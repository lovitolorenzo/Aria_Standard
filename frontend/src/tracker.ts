import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const SupplyChainTracker = () => {
	const [loading, setLoading] = useState(false);
	const [productId, setProductId] = useState("");
	const [currentStep, setCurrentStep] = useState({
		name: "",
		description: "",
		additionalData: [{ key: "", value: "" }],
	});

	const addDataField = () => {
		setCurrentStep((prev) => ({
			...prev,
			additionalData: [...prev.additionalData, { key: "", value: "" }],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// Here you would interact with your blockchain contract
			// Example: await contract.addProductionStep(...)
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
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
							onChange={(e) => setProductId(e.target.value)}
							placeholder="Enter product ID"
							className="w-full"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Step Name</label>
						<Input
							type="text"
							value={currentStep.name}
							onChange={(e) => setCurrentStep((prev) => ({ ...prev, name: e.target.value }))}
							placeholder="Enter step name"
							className="w-full"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Description</label>
						<Input
							type="text"
							value={currentStep.description}
							onChange={(e) => setCurrentStep((prev) => ({ ...prev, description: e.target.value }))}
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
									onChange={(e) => {
										const newData = [...currentStep.additionalData];
										newData[index].key = e.target.value;
										setCurrentStep((prev) => ({ ...prev, additionalData: newData }));
									}}
									className="w-1/2"
								/>
								<Input
									placeholder="Value"
									value={field.value}
									onChange={(e) => {
										const newData = [...currentStep.additionalData];
										newData[index].value = e.target.value;
										setCurrentStep((prev) => ({ ...prev, additionalData: newData }));
									}}
									className="w-1/2"
								/>
							</div>
						))}
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
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
