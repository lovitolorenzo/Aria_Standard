import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Welcome to Aria Standard</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-gray-600">Track and manage your supply chain with blockchain technology.</p>
				<Link to="/tracker">
					<Button>Go to Supply Chain Tracker</Button>
				</Link>
			</CardContent>
		</Card>
	);
};

export default Home;
