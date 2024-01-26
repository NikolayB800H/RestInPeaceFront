export interface InterfaceDataTypeProps {
    data_type_id: string
    image_path: string
    data_type_name: string
    precision: number
    description: string
    unit: string
    data_type_status: string
}

export interface InterfaceForecastAppsProps {
    application_id: string
    application_status: string
    calculate_status: string | null
    application_creation_date: string
    application_formation_date: string | null
    application_completion_date: string | null
    creator_id: string
    creator: string
    moderator_id: string | null
    input_start_date: string | null
}

export interface InterfaceShortDraft {
    application_id: string
    data_type_count: number
}

export interface InterfaceDataTypeExtendedProps extends InterfaceDataTypeProps {
    input_first: number | null
    input_second: number | null
    input_third: number | null
    output: number | null
}

export interface InterfaceForecastAppsExtendedProps extends InterfaceForecastAppsProps {
    calculated: number
    total: number
}
