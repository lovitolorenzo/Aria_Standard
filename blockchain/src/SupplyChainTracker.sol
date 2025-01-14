// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// src/StandardTracker.sol
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract StandardTracker is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct ProductionStep {
        string stepName;
        uint256 timestamp;
        address operator;
        bool completed;
        mapping(string => string) data;
    }

    struct BatchProduct {
        string productName;
        uint256 batchId;
        uint256 quantity;
        uint256 currentStep;
        string[] requiredSteps;
        bool completed;
        mapping(uint256 => ProductionStep) steps;
    }

    mapping(uint256 => BatchProduct) public batches;
    uint256 public nextBatchId = 1;

    event BatchCreated(uint256 indexed batchId, string productName, uint256 quantity);
    event StepCompleted(uint256 indexed batchId, string stepName, address operator);
    event BatchCompleted(uint256 indexed batchId);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createBatch(uint256 batchId, string memory productName, uint256 quantity, string[] memory steps)
        external
        returns (uint256)
    {
        require(quantity > 0, "Quantity must be positive");
        require(steps.length > 0, "Must have steps");

        BatchProduct storage batch = batches[batchId];
        batch.productName = productName;
        batch.batchId = batchId;
        batch.quantity = quantity;
        batch.requiredSteps = steps;

        emit BatchCreated(batchId, productName, quantity);
        return batchId;
    }

    function completeStep(
        uint256 batchId,
        string calldata stepName,
        string[] calldata dataKeys,
        string[] calldata dataValues
    ) external onlyRole(OPERATOR_ROLE) whenNotPaused {
        BatchProduct storage batch = batches[batchId];
        require(!batch.completed, "Batch already completed");
        require(batch.currentStep < batch.requiredSteps.length, "All steps completed");
        require(
            keccak256(bytes(batch.requiredSteps[batch.currentStep])) == keccak256(bytes(stepName)),
            "Invalid step sequence"
        );

        ProductionStep storage step = batch.steps[batch.currentStep];
        step.stepName = stepName;
        step.timestamp = block.timestamp;
        step.operator = msg.sender;
        step.completed = true;

        for (uint256 i = 0; i < dataKeys.length; i++) {
            step.data[dataKeys[i]] = dataValues[i];
        }

        emit StepCompleted(batchId, stepName, msg.sender);

        batch.currentStep++;
        if (batch.currentStep == batch.requiredSteps.length) {
            batch.completed = true;
            emit BatchCompleted(batchId);
        }
    }

    function getBatchDetails(uint256 batchId)
    external
    view
    returns (
        string memory productName,
        uint256 batchIdOut,
        uint256 quantity,
        uint256 currentStep,
        string[] memory requiredSteps,
        bool completed
    )
    {
        BatchProduct storage batch = batches[batchId];
        return (
            batch.productName,
            batch.batchId,
            batch.quantity,
            batch.currentStep,
            batch.requiredSteps,
            batch.completed
        );
    }

}
