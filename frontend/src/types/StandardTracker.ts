import { ethers, ContractTransactionResponse } from "ethers";

export type StandardTrackerContract = ethers.Contract & {
	createBatch(
		batchId: number,
		productName: string,
		quantity: number,
		steps: string[],
	): Promise<ContractTransactionResponse>;

	completeStep(
		batchId: number,
		stepName: string,
		dataKeys: string[],
		dataValues: string[],
	): Promise<ContractTransactionResponse>;

	// Replace 'batches' with our new function
	getBatchDetails(batchId: number): Promise<
		[
			string, // productName
			bigint, // batchIdOut
			bigint, // quantity
			bigint, // currentStep
			string[], // requiredSteps
			boolean, // completed
		]
	>;
};

// standardtracker.ts
export interface BatchDetails {
	productName: string;
	batchId: bigint;
	quantity: bigint;
	currentStep: bigint;
	requiredSteps: string[];
	completed: boolean;
}
