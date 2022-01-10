import React, { useEffect, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { getAllJobs } from "../services/JobService";
import { mapParamsStringToArray, ScriptDto } from "./Scripts";
import { executeJob } from "../services/ExecutionService";

export type Job = {
	id: any;
	name: string;
	scripts: any[];
	params: string;
};

export const Jobs = () => {
	const [jobs, setJobs] = useState<any[]>([]);
	const [jobParams, setJobParams] = useState<any[]>([]);

	useEffect(() => {
		getAllJobs()
			.then(jobs => setJobs(jobs))
			.catch(alert);
	}, []);

	const formatParamsToSend = (params: any) => {
		let formattedParams = {};
		params.map((param: any) => {
			const entries = Object.entries(param);
			const name: any = entries[0][1];
			const value = entries[1][1];
			formattedParams = {
				...formattedParams,
				[name]: value,
			};
		});

		return formattedParams;
	};

	const renderJobsParams = (job: Job) => {
		if (job.params && job.params.length !== 0 && job.params !== "{}") {
			const paramArray = mapParamsStringToArray(job.params);
			let paramsForCurrentJob = jobParams.find(param => param.jobId === job.id);
			if (!paramsForCurrentJob) {
				const initializedParamsForJob: { name: string; value: string }[] = [];
				paramArray.map(param => {
					const paramName = Object.keys(param)[0];
					const paramType = param[paramName];
					const newParamEntry = {
						name: paramName,
						value: "",
						type: paramType,
					};
					initializedParamsForJob.push(newParamEntry);
				});

				const initializedScriptParamsForJob: any[] = [];
				const initializedAllScriptParamsForJob: any[] = [];
				job.scripts.forEach(script => {
					const scriptParamArray = mapParamsStringToArray(script.params);
					scriptParamArray.map(param => {
						const paramName = Object.keys(param)[0];
						const paramType = param[paramName];
						const newParamEntry = {
							name: paramName,
							value: "",
							type: paramType,
						};

						initializedScriptParamsForJob.push(newParamEntry);
					});

					const newScriptParamsEntry = {
						scriptId: script.id,
						params: [...initializedScriptParamsForJob],
					};

					initializedAllScriptParamsForJob.push(newScriptParamsEntry);
				});

				const jobParamsToAdd = {
					jobId: job.id,
					params: [...initializedParamsForJob],
					scripts: [...initializedAllScriptParamsForJob],
				};

				setJobParams([...jobParams, jobParamsToAdd]);

				paramsForCurrentJob = jobParamsToAdd;
			}

			return paramArray.map(param => {
				const paramName = Object.keys(param)[0];

				const currentParam = paramsForCurrentJob.params.find(
					(param: any) => param.name === paramName
				);

				return (
					<>
						<div>
							{paramName}
							{/* script1, script2... are reserved for scripts result to pass in another scripts*/}
							{!paramName.includes("script") && (
								<>
									: {"\n"}
									<TextField
										type={currentParam.type}
										value={(currentParam && currentParam.value) || ""}
										onChange={e => {
											const paramToUpdate = paramsForCurrentJob.params.find(
												(param: any) => param.name === paramName
											);
											paramToUpdate.value = e.target.value;
											paramsForCurrentJob.scripts.forEach((script: any) => {
												const scriptParamsToFillWithJobValue = script.params.find(
													(param: any) => param.name === paramToUpdate.name
												);
												if (scriptParamsToFillWithJobValue) {
													scriptParamsToFillWithJobValue.value = e.target.value;
												}
											});

											setJobParams([...jobParams]);
										}}
									/>
									{currentParam.type}
								</>
							)}
						</div>
					</>
				);
			});
		}
	};
	const renderScriptParams = (job: Job, script: ScriptDto): JSX.Element => {
		if (script.params && script.params.length !== 0 && script.params !== "{}") {
			const currentJobParams = jobParams.find(param => param.jobId === job.id);
			if (!currentJobParams) {
				return <></>;
			}
			const jobScripts = currentJobParams.scripts;
			return jobScripts.map((script: any) => {
				return script.params.map((param: any) => {
					const paramName = param.name;
					const paramType = param.type;

					return (
						<>
							<div>
								{paramName}
								{/* script1, script2... are reserved for scripts result to pass in another*/}
								{!paramName.includes("script") && (
									<>
										: {"\n"}
										<TextField
											type={paramType}
											value={(param && param.value) || ""}
											onChange={e => {
												param.value = e.target.value;
												setJobParams([...jobParams]);
											}}
										/>
										{paramType}
									</>
								)}
							</div>
						</>
					);
				});
			});
		}
		return <></>;
	};

	return (
		<>
			<Box>
				{jobs &&
					jobs.map(job => (
						<Accordion>
							<AccordionSummary expandIcon={"v"}>
								<Typography sx={{ width: "33%", flexShrink: 0 }}>{job.name}</Typography>
								<Typography sx={{ color: "text.secondary" }}>{job.id}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								{renderJobsParams(job)}
								<Typography>Scripts: {"\n"}</Typography>
								{job.scripts &&
									job.scripts.map((script: any) => (
										<>
											<h1>
												{script.id}: {script.name}
											</h1>
											{renderScriptParams(job, script)}
										</>
									))}
								<Button
									variant='contained'
									onClick={() => {
										const inputParams = jobParams.find(param => param.jobId === job.id);
										let params = {};
										if (inputParams) {
											params = inputParams.params;
										}
										executeJob(job.id, formatParamsToSend(params))
											.then(alert)
											.catch(alert);
									}}
								>
									Run
								</Button>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</>
	);
};
