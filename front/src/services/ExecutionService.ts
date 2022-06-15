import { BACK_URL } from "../utils/Constants";
import axios from "axios";

const EXECUTION_URL = BACK_URL + "executions/";

export const executeJob = (id: any, params: any) => {
	return axios
		.post(EXECUTION_URL, {
			id,
			params,
		})
		.then(resp => resp.data);
};