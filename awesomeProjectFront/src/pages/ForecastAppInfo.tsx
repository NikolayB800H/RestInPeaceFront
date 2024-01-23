import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup, Stack } from 'react-bootstrap';
import { axiosAPI } from "../api";
import { getForecastApplication } from '../api/ForecastApps';
import { InterfaceForecastAppsProps, InterfaceDataTypeExtendedProps } from "../models";
import { AppDispatch, RootState } from "../store";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { SmallDataTypeCard } from '../components/DataTypeCard';
import Breadcrumbs from '../components/Breadcrumbs';
import OneDatePicker from '../components/OneDatePicker';
import { Delim } from '../components/Delim';
import InputFormMy from '../components/InputFormMy';
import { MODERATOR } from '../components/AuthCheck';

const ForecastAppInfo = () => {
    let { application_id } = useParams()
    const [application, setApplication] = useState<InterfaceForecastAppsProps | null>(null)
    const [composition, setComposition] = useState<InterfaceDataTypeExtendedProps[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false);
    const [inputStartDate, setInputStartDate] = useState<Date | null>(null);
    const navigate = useNavigate();
    const role = useSelector((state: RootState) => state.user.role);

    const useGetData = () => {
        setLoaded(false)
        getForecastApplication(application_id)
            .then(data => {
                if (data === null) {
                    setApplication(null)
                    setComposition([])
                } else {
                    setApplication(data.application);
                    setInputStartDate(data.application.input_start_date ? new Date(data.application.input_start_date) : null)
                    setComposition(data.data_types);
                }
                setLoaded(true)
            })/*
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            })*/;
    }

    const useUpdate = () => {
        const toLocal = (date: Date | null) => {
            if (date === null) return date;
            return new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1000);
        }
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/forecast_applications/update`,
            { input_start_date: toLocal(inputStartDate) },
            {
                headers: {
                    'Authorization': `Bearer${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => useGetData())/*
            .catch((error) => {
                console.error("Error fetching data:", error);
            })*/;
        setEdit(false);
    }

    useEffect(() => {
        dispatch(addToHistory({ path: location, name: "Заявка на прогноз" }))
        useGetData()
        setLoaded(true)
    }, [dispatch]);

    const useDelFromTransportation = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/forecast_applications/delete_data_type/${id}`, {
                headers: { 'Authorization': `Bearer${accessToken}`, }
            })
            .then(() => useGetData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken || inputStartDate === null) {
            return
        }
        axiosAPI.put('/forecast_applications/user_confirm', null, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(_ => {
                useGetData()
            })/*
            .catch((error) => {
                console.error("Error fetching data:", error);
            })*/;
    }

    const deleteT = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/forecast_applications', { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(_ => {
                navigate('/data_types')
            })/*
            .catch((error) => {
                console.error("Error fetching data:", error);
            })*/;
    }

    const moderator_confirm = (status: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/forecast_applications/${application?.application_id}/moderator_confirm`,
            { status: status },
            { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => useGetData())
    }

    return (
        <LoadAnimation loaded={loaded}>
            {application ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Col className='pt-1'>
                        <Card className='shadow-sm text center text-md-start'>
                            <Card.Body className='pt-1'>
                                <InputGroup className='mb-3 shadow-sm rounded-2'>
                                    <InputGroup.Text className='w-25 t-input-group-text'>Статус заявки</InputGroup.Text>
                                    <Delim />
                                    <Form.Control readOnly value={application.application_status} />
                                </InputGroup>
                                <InputGroup className='mb-3 shadow-sm rounded-2'>
                                    <InputGroup.Text className='w-25 t-input-group-text'>Создана</InputGroup.Text>
                                    <Delim />
                                    <Form.Control readOnly value={application.application_creation_date} />
                                </InputGroup>
                                {application.application_status != 'черновик' && <InputGroup className='mb-3 shadow-sm rounded-2'>
                                    <InputGroup.Text className='w-25 t-input-group-text'>Сформирована</InputGroup.Text>
                                    <Delim />
                                    <Form.Control readOnly value={application.application_formation_date ? application.application_formation_date : ''} />
                                </InputGroup>}
                                {(application.application_status == 'отклонён' || application.application_status == 'завершён') && <InputGroup className='mb-3 shadow-sm rounded-2'>
                                    <InputGroup.Text className='w-25 t-input-group-text'>{application.application_status === 'отклонён' ? 'отклонён' : 'завершён'}</InputGroup.Text>
                                    <Form.Control readOnly value={application.application_completion_date ? application.application_completion_date : ''} />
                                </InputGroup>
                                }
                                <InputGroup className='mb-3 shadow-sm rounded-2 flex-grow-1 w-auto' style={{display: 'inline-flex'}}>
                                    <InputGroup.Text className='t-input-group-text my-0 me-5'>Дата начала измерений</InputGroup.Text>
                                    <Delim className='ms-5' />
                                    <OneDatePicker
                                        disabled={!edit}
                                        selected={inputStartDate ? inputStartDate : null}
                                        onChange={(date: Date) => setInputStartDate(date)}
                                    />
                                    {application.application_status === 'черновик' && <Delim />}
                                    {!edit && application.application_status === 'черновик' && <Button variant='outline-dark' onClick={() => setEdit(true)}>✏️</Button>}
                                    {edit && <Button variant='success' onClick={useUpdate}>✅</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setInputStartDate(application.input_start_date ? new Date(application.input_start_date) : null);
                                            setEdit(false);
                                        }}>
                                        ❌
                                    </Button>}
                                </InputGroup>
                                <br></br>
                                {application.application_status != 'черновик' &&
                                    <InputGroup className='shadow-sm rounded-2'>
                                        <InputGroup.Text className='w-25 t-input-group-text'>Статус рассчёта</InputGroup.Text>
                                        <Delim />
                                        <Form.Control readOnly value={application.calculate_status ? application.calculate_status : ''} />
                                    </InputGroup>
                                }
                                {application.application_status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-50 shadow-sm'>
                                        <Button className='w-50' variant='outline-success' onClick={confirm}>Сформировать и начать рассчёт</Button>
                                        <Delim />
                                        <Button className='w-50' variant='outline-danger' onClick={deleteT}>Удалить</Button>
                                    </ButtonGroup>
                                }
                                {application.application_status == 'сформирован' && role == MODERATOR &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={moderator_confirm("завершён")}>Одобрить завершение</Button>
                                        <Button variant='danger' onClick={moderator_confirm("отклонён")}>Отклонить</Button>
                                    </ButtonGroup>
                                }
                            </Card.Body>
                        </Card>
                        {composition && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {composition.map((dataType) => (
                                <div className='d-flex p-2 justify-content-center' key={dataType.data_type_id}>
                                    <Stack gap={2}>
                                        <SmallDataTypeCard {...dataType}>
                                            {application.application_status == 'черновик' &&
                                                <Button
                                                    disabled={true}
                                                    variant='secondary'
                                                    className='m-0 py-6'>
                                                </Button>
                                            }
                                            {application.application_status == 'черновик' &&
                                                <Button
                                                    variant='outline-danger'
                                                    className='mt-0'
                                                    onClick={useDelFromTransportation(dataType.data_type_id)}>
                                                    Удалить
                                                </Button>}
                                        </SmallDataTypeCard>
                                        <InputFormMy {...dataType}
                                            input_start_date={inputStartDate}
                                            application_status={application.application_status}>
                                        </InputFormMy>
                                    </Stack>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такой заявки не существует</h4>
            )}
        </LoadAnimation>
    )
}

export default ForecastAppInfo
