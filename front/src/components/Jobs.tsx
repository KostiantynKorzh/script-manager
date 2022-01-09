import React, { useEffect, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Typography,
} from "@mui/material";
import { getAllJobs } from "../services/JobService";
import { executeJob } from "../services/ExecutionService";
import { renderParamsInput } from "./Scripts";

export const Jobs = () => {
	const [jobs, setJobs] = useState<any[]>([]);
	const [inputs, setInputs] = useState<any[]>([]);

	useEffect(() => {
		getAllJobs()
			.then(jobs => setJobs(jobs))
			.catch(alert);
	}, []);

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
								<Typography>Scripts: {"\n"}</Typography>
								{job.scripts &&
									job.scripts.map((script: any) => (
										<>
											<h1>
												{script.id}: {script.name}
											</h1>
											{(() => {
												if (
													script.params &&
													script.params.length !== 0 &&
													script.params !== "{}"
												) {
													return (
														<>
															<Typography>Params: {"\n"}</Typography>
															{renderParamsInput(
																script.params,
																(paramName: string, value: any) => {
																	const inputToUpdateIndex = inputs.findIndex(
																		input => input.id === job.id
																	);
																	if (inputToUpdateIndex !== -1) {
																		const inputToUpdate = inputs[inputToUpdateIndex];
																		inputToUpdate.params = {
																			...inputToUpdate.params,
																			[paramName]: value,
																		};
																		setInputs([...inputs]);
																	} else {
																		const newInput = {
																			id: job.id,
																			params: {
																				[paramName]: value,
																			},
																		};
																		setInputs([...inputs, { ...newInput }]);
																	}
																}
															)}
														</>
													);
												}
											})()}
										</>
									))}
								<Button
									variant='contained'
									onClick={() => {
										const inputParams = inputs.find(input => input.id === job.id);
										let params = {};
										if (inputParams) {
											params = inputParams.params;
										}
										executeJob(job.id, params).then(alert).catch(alert);
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
