import React from "react";
import Tracker from "./Tracker";
import BatchViewer from "./BatchViewer";

const SupplyChainTracker = () => {
	return (
		<div className="space-y-6 p-4">
			<Tracker />
			<BatchViewer />
		</div>
	);
};

export default SupplyChainTracker;
