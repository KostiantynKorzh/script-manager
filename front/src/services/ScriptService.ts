import { BACK_URL } from "../utils/Constants";
import axios from "axios";

export const getAllScripts = () => {
	return axios.get(BACK_URL + "scripts").then(resp => resp.data);
};