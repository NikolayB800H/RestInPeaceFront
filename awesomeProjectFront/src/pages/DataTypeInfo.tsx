import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"
import { InterfaceDataTypeProps } from '../models';
import { BigDataTypeCard } from '../components/DataTypeCard';
import LoadAnimation from '../components/LoadAnimation';
import Breadcrumbs from '../components/Breadcrumbs';
import { getDataType } from '../api';

const DataTypeInfo: FC = () => {
    let { data_type_id } = useParams()
    const [dataType, setDataType] = useState<InterfaceDataTypeProps | undefined>(undefined)
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    console.log()

    useEffect(() => {
        getDataType(data_type_id)
            .then(data => {
                setDataType(data);
                dispatch(addToHistory({ path: location, name: data ? data.data_type_name : "ошибка" }));
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [dispatch]);

    return (
        <LoadAnimation loaded={loaded}>
            {dataType ? (
                    <>
                        <Navbar>
                            <Breadcrumbs />
                        </Navbar>
                        <BigDataTypeCard {...dataType} />
                    </>
                ) : (
                    <h3 className='text-center'>Такого вида данных не существует</h3>
                )}
        </LoadAnimation>
    )
}

export default DataTypeInfo;
