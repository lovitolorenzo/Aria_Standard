import { ethers, ContractTransaction, BigNumberish } from "ethers";

export type StandardTrackerContract = ethers.Contract & {
	completeStep: (
		batchId: BigNumberish,
		stepName: string,
		dataKeys: string[],
		dataValues: string[],
	) => Promise<ContractTransaction>;

	batches: (batchId: BigNumberish) => Promise<
		[
			string, // productName
			bigint, // batchId
			bigint, // quantity
			bigint, // currentStep
			string[], // requiredSteps
			boolean, // completed
		]
	>;

	createBatch: (productName: string, quantity: BigNumberish, steps: string[]) => Promise<ContractTransaction>;
};

export interface BatchDetails {
	productName: string;
	batchId: bigint;
	quantity: bigint;
	currentStep: bigint;
	requiredSteps: string[];
	completed: boolean;
}
