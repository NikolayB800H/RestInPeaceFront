import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';
import { axiosAPI } from "../api";
import { getForecastApplication } from '../api/ForecastApps';
import { InterfaceForecastAppsProps, InterfaceDataTypeProps } from "../models";
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { SmallDataTypeCard } from '../components/DataTypeCard';
import Breadcrumbs from '../components/Breadcrumbs';

const ForecastAppInfo = () => {
    let { application_id } = useParams()
    const [application, setApplication] = useState<InterfaceForecastAppsProps | null>(null)
    const [composition, setComposition] = useState<InterfaceDataTypeProps[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [inputStartDate, setInputStartDate] = useState<string>('')
    const navigate = useNavigate()

    const useGetData = () => {
        setLoaded(false)
        getForecastApplication(application_id)
            .then(data => {
                if (data === null) {
                    setApplication(null)
                    setComposition([])
                } else {
                    setApplication(data.application);
                    setInputStartDate(data.application.input_start_date ? data.application.input_start_date : '')
                    setComposition(data.data_types);

                }
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            });
    }

    const useUpdate = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/forecast_applications/update`,
            { input_start_date: inputStartDate },
            {
                headers: {
                    'Authorization': `Bearer${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => useGetData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEdit(false);
    }

    useEffect(() => {
        useGetData()
        dispatch(addToHistory({ path: location, name: "Заявка на прогноз" }))
    }, [dispatch]);

    const useDelFromTransportation = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/forecast_applications/delete_data_type/${id}`, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => useGetData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put('/forecast_applications/user_confirm', null, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(_ => {
                useGetData()
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const deleteT = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/forecast_applications', { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(_ => {
                navigate('/data_types')
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    console.log(application)

    return (
        <LoadAnimation loaded={loaded}>
            {application ? (
                <>
                    <Navbar>
                            <Breadcrumbs />
                    </Navbar>
                    <Col className='p-3 pt-1'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Статус заявки</InputGroup.Text>
                                    <Form.Control readOnly value={application.application_status} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Создана</InputGroup.Text>
                                    <Form.Control readOnly value={application.application_creation_date} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Сформирована</InputGroup.Text>
                                    <Form.Control readOnly value={application.application_formation_date ? application.application_formation_date : ''} />
                                </InputGroup>
                                {(application.application_status == 'отклонён' || application.application_status == 'завершён') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>{application.application_status === 'отклонён' ? 'Отклонена' : 'Подтверждена'}</InputGroup.Text>
                                    <Form.Control readOnly value={application.application_completion_date ? application.application_completion_date : ''} />
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Дата начала измерений</InputGroup.Text>
                                    <Form.Control
                                        readOnly={!edit}
                                        value={inputStartDate}
                                        onChange={(e) => setInputStartDate(e.target.value)}
                                    />
                                    {!edit && application.application_status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={useUpdate}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setInputStartDate(application.input_start_date ? application.input_start_date : '');
                                            setEdit(false)
                                        }}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {application.application_status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Статус рассчёта</InputGroup.Text>
                                        <Form.Control readOnly value={application.calculate_status ? application.calculate_status : ''} />
                                    </InputGroup>}
                                {application.application_status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteT}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {composition && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {composition.map((dataType) => (
                                <div className='d-flex p-2 justify-content-center' key={dataType.data_type_id}>
                                    <SmallDataTypeCard  {...dataType}>
                                        {application.application_status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={useDelFromTransportation(dataType.data_type_id)}>
                                                Удалить
                                            </Button>}
                                    </SmallDataTypeCard>
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
