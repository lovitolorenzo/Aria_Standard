import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Tracker from "./pages/Tracker";
import BatchViewer from "./pages/BatchViewer";

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="tracker" element={<Tracker />} />
					<Route path="batch-viewer" element={<BatchViewer />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
