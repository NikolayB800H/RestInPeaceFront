import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SmallDataTypeCard } from '../components/DataTypeCard';
import { InterfaceDataTypeProps, InterfaceShortDraft } from "../models";
import { AppDispatch, RootState } from "../store";
import { clearHistory, addToHistory } from "../store/historySlice";
import { getDataTypes, axiosAPI } from '../api';
import LoadAnimation from '../components/LoadAnimation';
import { setDataTypeName as setter } from "../store/searchSlice";

const data_types = '/data_types';

const DataTypes = () => {
    const searchText = useSelector((state: RootState) => state.search.data_type_name);
    const [dataTypes, setDataTypes] = useState<InterfaceDataTypeProps[]>([])
    const [draft, setDraft] = useState<InterfaceShortDraft | null>(null)
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const useGetDataTypes = () =>
        getDataTypes(searchText)
            .then(data => {
                setDataTypes(data.data_types)
                setDraft(data.draft_application)
                console.log(draft)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const useHandleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setDataTypes([]);
        useGetDataTypes();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Виды данных" }))
        useGetDataTypes();
    }, [dispatch]);

    const useAddToForecastApplication = (id: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }

        axiosAPI.post(`${data_types}/${id}/add_to_forecast_application`, null, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => {
                useGetDataTypes();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    console.log(draft)

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={useHandleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow-sm"
                        data-bs-theme="outline-dark"
                        value={searchText}
                        onChange={(e) => dispatch(setter(e.target.value))}
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
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
                <LoadAnimation loaded={dataTypes.length > 0}>
                    {dataTypes.map((dataType) => (
                        <div className='d-flex p-2 justify-content-center' key={dataType.data_type_id}>
                            <SmallDataTypeCard {...dataType}>
                                {role != 0 &&
                                    <Button
                                        disabled={true}
                                        variant='secondary'
                                        className='m-0 py-6'>
                                    </Button>
                                }
                                {role != 0 &&
                                    <Button
                                        variant='outline-dark'
                                        className='mt-0'
                                        onClick={useAddToForecastApplication(dataType.data_type_id)}>
                                        Добавить в корзину
                                    </Button>
                                }
                            </SmallDataTypeCard>
                        </div>
                    ))}
                </LoadAnimation>
            </div>
            {(!!role && draft) && <div style={{ zIndex: '1000', margin: '5% auto'}} className="fixed-bottom container align-content-center d-flex justify-content-center">
                <Link to={`/forecast_applications/${draft!.application_id}`}>
                    <Button
                        className="rounded-pill shadow-sm"
                        variant="outline-dark"
                        disabled={!draft}>
                        Корзина
                    </Button>
                </Link>
            </div>}
        </>
    )
}

export default DataTypes;
