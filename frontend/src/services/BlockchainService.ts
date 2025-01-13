import { ethers, BrowserProvider, Contract, ContractTransactionResponse } from "ethers";
import type { StandardTrackerContract, BatchDetails } from "../types/StandardTracker";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const CONTRACT_ABI = [
	"function createBatch(string memory productName, uint256 quantity, string[] memory steps) external returns (uint256)",
	"function completeStep(uint256 batchId, string calldata stepName, string[] calldata dataKeys, string[] calldata dataValues) external",
	"function batches(uint256) external view returns (string memory productName, uint256 batchId, uint256 quantity, uint256 currentStep, string[] memory requiredSteps, bool completed)",
];

export class BlockchainService {
	private provider: ethers.BrowserProvider;
	private contract: StandardTrackerContract;

	constructor() {
		if (typeof window.ethereum === "undefined") {
			throw new Error("Please install MetaMask!");
		}
		this.provider = new BrowserProvider(window.ethereum);
		this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider) as StandardTrackerContract;
	}

	async connectWallet(): Promise<string[]> {
		try {
			const accounts = await this.provider.send("eth_requestAccounts", []);
			const signer = await this.provider.getSigner();
			this.contract = this.contract.connect(signer) as StandardTrackerContract;
			return accounts;
		} catch (error) {
			console.error("Error connecting wallet:", error);
			throw error;
		}
	}

	async completeProductionStep(
		batchId: number,
		stepName: string,
		additionalData: { key: string; value: string }[],
	): Promise<void> {
		try {
			const dataKeys = additionalData.map((item) => item.key);
			const dataValues = additionalData.map((item) => item.value);

			// Explicitly type the transaction response
			const tx: ContractTransactionResponse = await this.contract.completeStep(batchId, stepName, dataKeys, dataValues);

			// Wait for confirmation
			await tx.wait(1);
		} catch (error) {
			console.error("Error completing production step:", error);
			throw error;
		}
	}

	async getBatchDetails(batchId: number): Promise<BatchDetails> {
		try {
			const [productName, batchId_, quantity, currentStep, requiredSteps, completed] = await this.contract.batches(
				batchId,
			);

			return {
				productName,
				batchId: batchId_,
				quantity,
				currentStep,
				requiredSteps,
				completed,
			};
		} catch (error) {
			console.error("Error fetching batch details:", error);
			throw error;
		}
	}

	async createBatch(productName: string, quantity: number, steps: string[]): Promise<ContractTransactionResponse> {
		try {
			return await this.contract.createBatch(productName, quantity, steps);
		} catch (error) {
			console.error("Error creating batch:", error);
			throw error;
		}
	}
}
