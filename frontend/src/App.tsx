import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import SupplyChainTracker from "./pages/Tracker";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="tracker" element={<SupplyChainTracker />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
