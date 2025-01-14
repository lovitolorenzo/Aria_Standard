import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BlockchainService } from "../services/BlockchainService";
import type { BatchDetails } from "../types/StandardTracker";

const BatchViewer = () => {
	const [batchId, setBatchId] = useState<string>("");
	const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
	const [error, setError] = useState<string>("");
	const [blockchainService] = useState(new BlockchainService());

	const handleViewBatch = async () => {
		try {
			setError("");
			const details = await blockchainService.getBatchDetails(parseInt(batchId));
			setBatchDetails(details);
		} catch (error) {
			console.error("Error fetching batch:", error);
			setError("Failed to fetch batch details");
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto mt-4">
			<CardHeader>
				<CardTitle>View Batch Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4 mb-4">
					<Input
						type="number"
						value={batchId}
						onChange={(e) => setBatchId(e.target.value)}
						placeholder="Enter Batch ID"
						className="w-full"
					/>
					<Button onClick={handleViewBatch}>View</Button>
				</div>

				{error && <div className="text-red-500 mb-4">{error}</div>}

				{batchDetails && (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<div className="font-semibold">Product Name:</div>
							<div>{batchDetails.productName}</div>

							<div className="font-semibold">Quantity:</div>
							<div>{batchDetails.quantity.toString()}</div>

							<div className="font-semibold">Current Step:</div>
							<div>{batchDetails.currentStep.toString()}</div>

							<div className="font-semibold">Status:</div>
							<div>
								<Badge variant={batchDetails.completed ? "default" : "secondary"}>
									{batchDetails.completed ? "Completed" : "In Progress"}
								</Badge>
							</div>
						</div>

						<div>
							<div className="font-semibold mb-2">Required Steps:</div>
							<div className="flex flex-wrap gap-2">
								{batchDetails.requiredSteps.map((step: string, index: number) => (
									<Badge key={index} variant="outline">
										{step}
									</Badge>
								))}
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default BatchViewer;
