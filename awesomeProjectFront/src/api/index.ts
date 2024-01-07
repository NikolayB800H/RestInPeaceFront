import { data_types, draft_forecast_app } from './MockData';
import { InterfaceDataTypeProps } from '../models';
import axios, { AxiosRequestConfig } from 'axios';

const ip = 'localhost';
const port = '3000';
const api_data_types = '/data_types';
export const imagePlaceholder = `${import.meta.env.BASE_URL}Default.jpg`;

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 2000 });
//export const axiosImage = axios.create({ baseURL: `http://${ip}:${port}/images/`, timeout: 10000 });

export type Response = {
    draft_forecast_app: string | null;
    data_types: InterfaceDataTypeProps[];
}

function fromMock(filter?: string): Response {
    let filteredDataTypes = Array.from(data_types.values())
    if (filter !== undefined) {
        let type = filter.toLowerCase()
        filteredDataTypes = filteredDataTypes.filter(
            (data_type) => data_type.data_type_name.toLowerCase().includes(type)
        )
    }
    return { draft_forecast_app, data_types: filteredDataTypes }
}

export async function getDataType(dataTypeId?: string): Promise<InterfaceDataTypeProps | undefined> {
    if (dataTypeId === undefined) {
        return undefined
    }
    let url = `${api_data_types}/${dataTypeId}`
    return axiosAPI.get<InterfaceDataTypeProps>(url)
        .then(response => response.data)
        .catch(_ => data_types.get(dataTypeId))
}

export async function getDataTypes(filter?: string): Promise<Response> {
    let url = api_data_types
    if (filter !== undefined && filter !== "") {
        url += `/?data_type_name=${filter}`
    }
    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer${accessToken}`;
    }
    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(filter))
}
