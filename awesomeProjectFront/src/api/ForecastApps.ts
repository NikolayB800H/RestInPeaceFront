import { format } from 'date-fns';

import { axiosAPI } from ".";
import { InterfaceDataTypeExtendedProps, InterfaceForecastAppsProps } from "../models";

const forecast_applications = '/forecast_applications';

interface ForecastApplicationsResponse {
    applications: InterfaceForecastAppsProps[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
}

export async function getForecastApplications(
    user: string,
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<InterfaceForecastAppsProps[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return [];
    }
    return axiosAPI
        .get<ForecastApplicationsResponse>(forecast_applications, {
            params: {
                ...(status && { application_status: status }),
                ...(startDate && {
                    formation_date_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm:ss'),
                }),
                ...(endDate && {
                    formation_date_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm:ss'),
                }),
            },
            headers: {
                Authorization: `Bearer${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) =>
            response.data.applications
                .filter((tr: InterfaceForecastAppsProps) => tr.creator.toLowerCase().includes(user.toLowerCase()))
                .map((tr: InterfaceForecastAppsProps) => ({
                ...tr,
                application_creation_date: formatDate(new Date(tr.application_creation_date)),
                application_formation_date: tr.application_formation_date
                    ? formatDate(new Date(tr.application_formation_date))
                    : null,
                application_completion_date: tr.application_completion_date
                    ? formatDate(new Date(tr.application_completion_date))
                    : null,
            }))
        );
}

interface ForecastApplicationResponse {
    data_types: InterfaceDataTypeExtendedProps[]
    application: InterfaceForecastAppsProps
}

export async function getForecastApplication(id: string | undefined): Promise<ForecastApplicationResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return null;
    }

    return axiosAPI.get<ForecastApplicationResponse>(`${forecast_applications}/${id}`, {
        headers: {
            'Authorization': `Bearer${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedForecastApplication: InterfaceForecastAppsProps = {
                ...response.data.application,
                application_creation_date: formatDate(new Date(response.data.application.application_creation_date)),
                application_formation_date: response.data.application.application_formation_date
                    ? formatDate(new Date(response.data.application.application_formation_date))
                    : null,
                application_completion_date: response.data.application.application_completion_date
                    ? formatDate(new Date(response.data.application.application_completion_date))
                    : null,
            };

            return {
                ...response.data,
                application: modifiedForecastApplication,
            };
        })
}