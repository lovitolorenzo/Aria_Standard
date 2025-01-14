import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { BlockchainService } from "../services/BlockchainService";

interface DataField {
	key: string;
	value: string;
}

interface CurrentStep {
	name: string;
	description: string;
	additionalData: DataField[];
}

const SupplyChainTracker: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [productId, setProductId] = useState<string>("");
	const [blockchainService, setBlockchainService] = useState<BlockchainService | null>(null);
	const [currentStep, setCurrentStep] = useState<CurrentStep>({
		name: "",
		description: "",
		additionalData: [{ key: "", value: "" }],
	});

	useEffect(() => {
		const initBlockchain = async () => {
			try {
				const service = new BlockchainService();
				await service.connectWallet();
				setBlockchainService(service);
			} catch (error) {
				console.error("Error initializing blockchain:", error);
			}
		};
		initBlockchain();
	}, []);

	const resetForm = () => {
		setProductId("");
		setCurrentStep({
			name: "",
			description: "",
			additionalData: [{ key: "", value: "" }],
		});
	};

	const addDataField = (): void => {
		setCurrentStep((prev) => ({
			...prev,
			additionalData: [...prev.additionalData, { key: "", value: "" }],
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		if (!blockchainService) {
			console.error("Blockchain service not initialized");
			return;
		}
		setLoading(true);
		try {
			// Create a new batch
			const tx = await blockchainService.createBatch(
				productId,
				1, // quantity
				[currentStep.name], // steps array
			);
			console.log("Transaction:", tx);

			// Wait for confirmation
			const receipt = await tx.wait();
			console.log("Receipt:", receipt);

			// Reset form after successful submission
			resetForm();
		} catch (error) {
			console.error("Error creating batch:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (field: keyof CurrentStep, value: string): void => {
		setCurrentStep((prev) => ({ ...prev, [field]: value }));
	};

	const handleDataFieldChange = (index: number, field: keyof DataField, value: string): void => {
		const newData = [...currentStep.additionalData];
		newData[index][field] = value;
		setCurrentStep((prev) => ({ ...prev, additionalData: newData }));
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Production Step Tracker</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Product ID</label>
						<Input
							type="text"
							value={productId}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setProductId(e.target.value)}
							placeholder="Enter product ID"
							className="w-full"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Step Name</label>
						<Input
							type="text"
							value={currentStep.name}
							onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
							placeholder="Enter step name"
							className="w-full"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Description</label>
						<Input
							type="text"
							value={currentStep.description}
							onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("description", e.target.value)}
							placeholder="Enter step description"
							className="w-full"
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium">Additional Data</label>
							<Button type="button" onClick={addDataField} variant="outline" size="sm">
								Add Field
							</Button>
						</div>

						{currentStep.additionalData.map((field, index) => (
							<div key={index} className="flex gap-2">
								<Input
									placeholder="Key"
									value={field.key}
									onChange={(e: ChangeEvent<HTMLInputElement>) => handleDataFieldChange(index, "key", e.target.value)}
									className="w-1/2"
								/>
								<Input
									placeholder="Value"
									value={field.value}
									onChange={(e: ChangeEvent<HTMLInputElement>) => handleDataFieldChange(index, "value", e.target.value)}
									className="w-1/2"
								/>
							</div>
						))}
					</div>

					<Button type="submit" className="w-full" disabled={loading || !blockchainService}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Recording Step...
							</>
						) : (
							"Record Production Step"
						)}
					</Button>
				</form>

				<div className="mt-6">
					<h3 className="text-sm font-medium mb-2">Current Status</h3>
					<div className="flex gap-2">
						<Badge variant="secondary" className="text-xs">
							Product ID: {productId || "Not Set"}
						</Badge>
						<Badge variant="secondary" className="text-xs">
							Step: {currentStep.name || "Not Set"}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SupplyChainTracker;
