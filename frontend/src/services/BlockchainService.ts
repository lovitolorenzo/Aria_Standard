import { ethers, BrowserProvider, Contract, ContractTransactionResponse } from "ethers";
import type { StandardTrackerContract, BatchDetails } from "../types/StandardTracker";

const CONTRACT_ADDRESS = "0x80B7D24885c6c3C659b8ab4D18E5F30142C976C2"; // Deployed contract address
const CONTRACT_ABI = [
	"function createBatch(uint256 batchId, string memory productName, uint256 quantity, string[] memory steps) external returns (uint256)",
	"function completeStep(uint256 batchId, string calldata stepName, string[] calldata dataKeys, string[] calldata dataValues) external",
	"function getBatchDetails(uint256 batchId) external view returns (string productName, uint256 batchIdOut, uint256 quantity, uint256 currentStep, string[] requiredSteps, bool completed)",
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
			console.log("Fetching batchId:", batchId);

			// Call the new Solidity function
			const [productName, batchIdOut, quantity, currentStep, requiredSteps, completed] =
				await this.contract.getBatchDetails(batchId);

			// Return the data in an object
			console.log("Batch Details:", {
				productName,
				batchId: batchIdOut,
				quantity,
				currentStep,
				requiredSteps,
				completed,
			});

			return {
				productName,
				batchId: batchIdOut,
				quantity,
				currentStep,
				requiredSteps,
				completed,
			};
		} catch (error) {
			console.error("Error fetching batch details:", { error, batchId, contractAddress: this.contract.target });
			throw error;
		}
	}

	async createBatch(
		batchId: number,
		productName: string,
		quantity: number,
		steps: string[],
	): Promise<ContractTransactionResponse> {
		try {
			console.log("Creating batch:", { batchId, productName, quantity, steps });
			return await this.contract.createBatch(batchId, productName, quantity, steps);
		} catch (error) {
			console.error("Error creating batch:", error);
			throw error;
		}
	}
}
