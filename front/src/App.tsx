import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JobCreationPage from "./components/pages/JobCreationPage";
import { Scripts } from "./components/Scripts";
import { Jobs } from "./components/Jobs";
import Header from "./components/Header";

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path={"/creation"} element={<JobCreationPage />} />
				<Route path={"/scripts"} element={<Scripts />} />
				<Route path={"/jobs"} element={<Jobs />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
