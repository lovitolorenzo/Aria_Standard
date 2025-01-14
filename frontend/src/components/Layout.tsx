import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<Link to="/" className="text-xl font-bold">
									Aria Standard
								</Link>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
								<Link
									to="/"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									Home
								</Link>
								<Link
									to="/tracker"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									Supply Chain Tracker
								</Link>
								<Link
									to="/batch-viewer"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									Batch Viewer
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
