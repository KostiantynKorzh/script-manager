import {BACK_URL} from "../utils/Constants";
import axios from "axios";

const JOBS_URL = BACK_URL + "jobs/";

export const getAllJobs = () => {
    return axios.get(JOBS_URL).then(resp => resp.data);
}