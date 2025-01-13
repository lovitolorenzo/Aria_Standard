import { ethers, ContractTransactionResponse } from "ethers";

export type StandardTrackerContract = ethers.Contract & {
	completeStep(
		batchId: number,
		stepName: string,
		dataKeys: string[],
		dataValues: string[],
	): Promise<ContractTransactionResponse>;

	batches(batchId: number): Promise<
		[
			string, // productName
			bigint, // batchId
			bigint, // quantity
			bigint, // currentStep
			string[], // requiredSteps
			boolean, // completed
		]
	>;

	createBatch(productName: string, quantity: number, steps: string[]): Promise<ContractTransactionResponse>;
};

export interface BatchDetails {
	productName: string;
	batchId: bigint;
	quantity: bigint;
	currentStep: bigint;
	requiredSteps: string[];
	completed: boolean;
}
