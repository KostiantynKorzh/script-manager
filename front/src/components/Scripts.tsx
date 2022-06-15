import React, { useEffect, useState } from "react";
import { getAllScripts } from "../services/ScriptService";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
} from "@mui/material";

export type ScriptDto = {
	id: any;
	name: string;
	body: string;
	params: string;
};

export const mapParamsStringToArray = (paramsString: string): any[] => {
	const paramsMap = JSON.parse(paramsString);
	const paramsArray: any[] = [];
	if (paramsMap) {
		Object.keys(paramsMap).forEach(key => {
			paramsArray.push({ [key]: paramsMap[key] });
		});
	}

	return paramsArray;
};

export const renderParamsInput = (
	paramsString: string,
	onChange: (paramName: string, value: any) => void
) => {
	const paramsArray = mapParamsStringToArray(paramsString);
	return paramsArray.map((param: any) => {
		const paramName = Object.keys(param)[0];
		const paramType = param[paramName];
		return (
			<div>
				{paramName}
				{/* script1, script2... are reserved for scripts result to pass in another scripts*/}
				{!paramName.includes("script") && (
					<>
						: {"\n"}
						{paramType}
					</>
				)}
			</div>
		);
	});
};

export const Scripts = () => {
	const [scripts, setScripts] = useState<ScriptDto[]>();

	useEffect(() => {
		getAllScripts()
			.then(scripts => {
				setScripts(scripts);
			})
			.catch(alert);
	}, []);

	const renderParams = (script: ScriptDto) => {
		if (script.params && script.params.length !== 0 && script.params !== "{}") {
			return (
				<>
					<Typography>Params: {"\n"}</Typography>
					{renderParamsInput(script.params, () => {})}
				</>
			);
		}
	};

	return (
		<>
			<Box>
				{scripts &&
					scripts.map(script => (
						<Accordion>
							<AccordionSummary expandIcon={"v"}>
								<Typography sx={{ width: "33%", flexShrink: 0 }}>
									{script.name}
								</Typography>
								<Typography sx={{ color: "text.secondary" }}>{script.id}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>Body: {"\n"}</Typography>
								<pre>{script.body}</pre>
								{renderParams(script)}
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</>
	);
};
