import React, { useEffect, useState } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";

export type ParamTypes = "string" | "number" | undefined;

export type ParamEntry = {
	id: any;
	name: string;
	type: string;
};

export type ParamsProps = {
	params: ParamEntry[];
	setParams: (params: ParamEntry[]) => void;
};

export const Params = ({ params, setParams }: ParamsProps) => {
	const paramEntries =
		params &&
		params.map(param => (
			<>
				<TextField
					value={param.name}
					onChange={e => {
						const paramToUpdate = params.find(
							paramToCheck => paramToCheck.id === param.id
						);
						if (paramToUpdate) {
							paramToUpdate.name = e.target.value;
							setParams([...params]);
						}
					}}
				/>
				<Select
					defaultValue={"string"}
					value={param.type}
					onChange={e => {
						const paramToUpdate = params.find(
							paramToCheck => paramToCheck.id === param.id
						);
						if (paramToUpdate) {
							paramToUpdate.type = e.target.value;
							setParams([...params]);
						}
					}}
				>
					<MenuItem value={"string"}>String</MenuItem>
					<MenuItem value={"number"}>Number</MenuItem>
				</Select>
			</>
		));

	return (
		<>
			{paramEntries}
			<div>
				<Button
					variant='contained'
					onClick={() => {
						setParams([
							...params,
							{
								id: new Date(),
								name: "",
								type: "string",
							},
						]);
					}}
				>
					Add param
				</Button>
			</div>
		</>
	);
};

export default Params;
