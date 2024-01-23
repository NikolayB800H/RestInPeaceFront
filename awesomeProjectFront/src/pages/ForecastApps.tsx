import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { axiosAPI } from '../api';
import { getForecastApplications } from '../api/ForecastApps';
import { InterfaceForecastAppsProps } from "../models";
import { AppDispatch, RootState } from "../store";
import { setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';

const forecast_applications = '/forecast_applications';

const ForecastApps = () => {
    const [forecastApplications, setForecastApplications] = useState<InterfaceForecastAppsProps[]>([])
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false);
    const userFilter = useSelector((state: RootState) => state.search.user);
    const [selectedKey, setSelectedKey] = useState("любой");

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) return;
        setSelectedKey(eventKey);
        if (eventKey === "любой") {
            dispatch(setStatus(""));
        } else {
            dispatch(setStatus(eventKey));
        }
    };

    const useGetData = () => {
        setLoaded(false)
        getForecastApplications(userFilter, statusFilter, startDate, endDate)
            .then((data) => {
                setLoaded(true);
                setForecastApplications(data)
            })/*
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            })*/
    };

    const useHandleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        /*useGetData()*/
    }

    useEffect(() => {
        dispatch(clearHistory());
        dispatch(addToHistory({ path: location, name: "Заявки на прогнозы" }));
        useGetData();
        const intervalId = setInterval(() => {
            useGetData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, statusFilter, startDate, endDate]);

    const moderator_confirm = (id: string, status: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/forecast_applications/${id}/moderator_confirm`,
            { status: status },
            { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => setForecastApplications(prevForecastApplications => [...prevForecastApplications]))
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={useHandleSearch}>
                    {role == MODERATOR && <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} onChange={(e) => dispatch(setUser(e.target.value))} />
                    </InputGroup>}
                    <InputGroup size='sm' className='shadow-sm rounded-1'>
                        <InputGroup.Text>Статус заявки:</InputGroup.Text>
                        <ButtonGroup size='sm' className='flex-grow-1 rounded-0'>
                        <DropdownButton
                            variant="outline-dark"
                            menuVariant="dark"
                            className="rounded-0"
                            title={selectedKey}
                            onSelect={handleSelect}
                        >
                        <Dropdown.Item eventKey="любой">любой</Dropdown.Item>
                        <Dropdown.Item eventKey="сформирован">сформирован</Dropdown.Item>
                        <Dropdown.Item eventKey="завершён">завершён</Dropdown.Item>
                        <Dropdown.Item eventKey="отклонён">отклонён</Dropdown.Item>
                        </DropdownButton>
                        </ButtonGroup>
                    </InputGroup>
                    <DateTimePicker
                        startDate={startDate ? new Date(startDate) : null}
                        setStartDate={(date: Date) => dispatch(setDateStart(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
                        endDate={endDate ? new Date(endDate) : null}
                        setEndDate={(date: Date) => dispatch(setDateEnd(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
                    />
                    <Button
                        variant="outline-dark"
                        size="sm"
                        type="submit"
                        className="shadow-sm">
                        🔎
                    </Button>
                </Form>
            </Navbar>
            <LoadAnimation loaded={loaded}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Создатель</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Статус рассчёта</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
                            <th className='text-center'>Дата начала измерений</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastApplications.map((application) => (
                            <tr key={application.application_id}>
                                {role == MODERATOR && <td className='text-center'>{application.creator} </td>}
                                <td className='text-center'>{application.application_status}</td>
                                <td className='text-center'>{application.calculate_status}</td>
                                <td className='text-center'>{application.application_creation_date}</td>
                                <td className='text-center'>{application.application_formation_date}</td>
                                <td className='text-center'>{application.application_completion_date}</td>
                                <td className='text-center'>{application.input_start_date}</td>
                                <td className='p-0 text-center align-middle'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`${forecast_applications}/${application.application_id}`}
                                                        className='shadow-sm btn btn-sm btn-outline-dark text-decoration-none w-100' >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                            {application.application_status == 'сформирован' && role == MODERATOR && <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <ButtonGroup className='shadow-sm flex-grow-1 w-100'>
                                                        <Button variant='outline-success' size='sm' onClick={moderator_confirm(application.application_id, "завершён")}>Одобрить завершение</Button>
                                                        <Button variant='outline-danger' size='sm' onClick={moderator_confirm(application.application_id, "отклонён")}>Отклонить</Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default ForecastApps;
