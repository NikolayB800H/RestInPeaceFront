import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { getDataTypes, axiosAPI } from '../api'
import { InterfaceDataTypeProps } from '../models'

import { AppDispatch, RootState } from "../store";
import { setDataTypeName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';


const DataTypesTable = () => {
    const searchText = useSelector((state: RootState) => state.search.data_type_name);
    const [dataTypes, setDataTypes] = useState<InterfaceDataTypeProps[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const navigate = useNavigate();

    const useGetDataTypes = () =>
        getDataTypes(searchText)
            .then(data => {
                setDataTypes(data.data_types)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setDataTypes([])
        useGetDataTypes();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Управление видами данных" }))
        useGetDataTypes();
    }, [dispatch]);

    const deleteDataType = (id: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/data_types/${id}`, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => useGetDataTypes())
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        type="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow-sm"
                        data-bs-theme="outline-dark"
                        value={searchText}
                        onChange={(e) => dispatch(setDataTypeName(e.target.value))}
                    />
                    <Button
                        variant="outline-dark"
                        size="sm"
                        type="submit"
                        className="shadow-sm">
                        🔎
                    </Button>
                    <Link to='new' className='btn btn-sm btn-outline-dark shadow-sm ms-sm-2'>➕</Link>
                </Form>
            </Navbar>
            < LoadAnimation loaded={dataTypes.length > 0}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'>Изображение</th>
                            <th className='text-center'>Название</th>
                            <th className='text-center'>Погрешность</th>
                            <th className='text-center'>Ед. изм.</th>
                            <th className='text-center text-nowrap'>Описание</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTypes.map((dataType) => (
                            <tr key={dataType.data_type_id}>
                                <td style={{ width: '15%' }} className='px-0 py-1'>
                                    <CardImage url={dataType.image_path} />
                                </td>
                                <td className='text-center'>{dataType.data_type_name}</td>
                                <td className='text-center'>{`±${dataType.precision}`}</td>
                                <td className='text-center'>{dataType.unit}</td>
                                <td className='text-center'>{dataType.description}</td>
                                <td className='text-center align-middle p-1 border-0'style={{ background: 'transparent' }}>
                                    <ButtonGroup className='shadow-sm flex-grow-1 w-100'>
                                        <Button
                                            variant="outline-dark"
                                            size='sm'
                                            onClick={() => {navigate(`/data_types-edit/${dataType.data_type_id}`)}}>
                                            ❓
                                        </Button>
                                        <Button
                                            variant='outline-danger'
                                            size='sm'
                                            onClick={deleteDataType(dataType.data_type_id)}>
                                            🗑️
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default DataTypesTable