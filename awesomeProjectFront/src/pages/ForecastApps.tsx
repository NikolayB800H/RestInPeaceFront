import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, Col, InputGroup } from 'react-bootstrap';

import { getForecastApplications } from '../api/ForecastApps';
import { InterfaceForecastAppsProps } from "../models";
import { AppDispatch, RootState } from "../store";
import { setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
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
    const [loaded, setLoaded] = useState(false)

    const useGetData = () => {
        setLoaded(false)
        getForecastApplications(statusFilter, startDate, endDate)
            .then((data) => {
                setForecastApplications(data)
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            })
    };

    const useHandleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        useGetData()
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Заявки на прогнозы" }))
        useGetData()
    }, [dispatch]);

    //TODO: fix time zones

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={useHandleSearch}>
                    <InputGroup size='sm'>
                        <InputGroup.Text >Статус заявки</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            onChange={(status) => dispatch(setStatus(status.target.value))}
                            className="shadow-sm"
                        >
                            <option value="">любой</option>
                            <option value="сформирован">сформирован</option>
                            <option value="завершён">завершён</option>
                            <option value="отклонён">отклонён</option>
                        </Form.Select>
                    </InputGroup>
                    <DateTimePicker
                        startDate={startDate ? new Date(startDate) : null}
                        setStartDate={(date: Date) => dispatch(setDateStart(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
                        endDate={endDate ? new Date(endDate) : null}
                        setEndDate={(date: Date) => dispatch(setDateEnd(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
                    />
                    <Button
                        variant="dark"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        🔎
                    </Button>
                </Form>
            </Navbar>
            <LoadAnimation loaded={loaded}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Пользователь</th>}
                            <th className='text-center'>Статус</th>
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
                                {role == MODERATOR && <td className='text-center'>{application.creator_id}</td>}
                                <td className='text-center'>{application.application_status}</td>
                                <td className='text-center'>{application.application_creation_date}</td>
                                <td className='text-center'>{application.application_formation_date}</td>
                                <td className='text-center'>{application.application_completion_date}</td>
                                <td className='text-center'>{application.input_start_date}</td>
                                <td className=''>
                                    <Col className='d-flex flex-col align-items-center justify-content-center'>
                                        <Link to={`${forecast_applications}/${application.application_id}`} className='text-decoration-none' >
                                            <Button
                                                variant='outline-secondary'
                                                size='sm'
                                                className='align-self-center'
                                            >
                                                Подробнее
                                            </Button>
                                        </Link>
                                    </Col>
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
