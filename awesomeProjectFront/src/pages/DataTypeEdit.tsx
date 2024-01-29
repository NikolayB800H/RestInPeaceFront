import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';
import { axiosAPI, getDataType } from '../api'
import { InterfaceDataTypeProps } from '../models';
import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"
import { Delim } from '../components/Delim';
import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/Breadcrumbs';

const DataTypeEdit: FC = () => {
    let { data_type_id } = useParams()
    const [dataType, setDataType] = useState<InterfaceDataTypeProps | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState<boolean>(false)
    const [image, setImage] = useState<File | undefined>(undefined);
    const [showImage, setShowImage] = useState<Boolean>(true);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: InterfaceDataTypeProps | undefined;
            let name: string;
            try {
                if (data_type_id == 'new') {
                    data = {
                        data_type_id: "",
                        image_path: "",
                        data_type_name: "",
                        precision: NaN,
                        description: "",
                        unit: "",
                        data_type_status: "",
                    }
                    name = 'Новый вид данных'
                    setEdit(true)
                } else {
                    data = await getDataType(data_type_id);
                    name = data ? data.data_type_name : ''
                }
                setDataType(data);
                dispatch(addToHistory({ path: location, name: name }));
            } finally {
                setLoaded(true);
            }
        }
        getData();
    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setDataType(dataType ? { ...dataType, [e.target.id]: e.target.value } : undefined)
    }

    const changeNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setDataType(dataType ? { ...dataType, [e.target.id]: parseInt(e.target.value) } : undefined)
    }

    const useDeleteDataType = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/data_types/${data_type_id}`, { headers: { 'Authorization': `Bearer${accessToken}`, } })
            .then(() => navigate('/data_types-edit'))
    }

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        if (!formElement.checkValidity()) {
            return
        }
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);

        const formData = new FormData();
        if (dataType) {
            Object.keys(dataType).forEach(key => {
                if ((dataType as any)[key]) {
                    formData.append(key, (dataType as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (data_type_id == 'new') {
            axiosAPI.post(`/data_types`, formData, { headers: { 'Authorization': `Bearer${accessToken}`, } })
                .then((response) => getDataType(response.data).then((data) => setDataType(data)))
        } else {
            setShowImage(false);
            console.log('save')
            axiosAPI.put(`/data_types/${dataType?.data_type_id}`, formData, { headers: { 'Authorization': `Bearer${accessToken}`, } })
                .then(() => getDataType(data_type_id).then((data) => {setDataType(data); setShowImage(true);}))
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getDataType(data_type_id)
            .then((data) => setDataType(data))
    }

    return (
        <LoadAnimation loaded={loaded}>
            {dataType ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg mb-3'>
                        <Row className='m-0'>
                            <Col className='col-12 col-md-8 overflow-hidden p-0'>
                                {showImage && <CardImage url={dataType.image_path} />}
                                {!showImage && <div className='px-5 my-0' style={{width:'800px', height: '760px'}}></div>}
                            </Col>
                            <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                                <Form noValidate validated={edit} onSubmit={save}>
                                    <Card.Body className='flex-grow-1'>
                                        <InputGroup hasValidation className='mb-3 shadow-sm rounded-2'>
                                            <InputGroup.Text className='c-input-group-text'>Название</InputGroup.Text>
                                            <Delim />
                                            <Form.Control id='data_type_name' required type='text' value={dataType.data_type_name} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-3 shadow-sm rounded-2'>
                                            <InputGroup.Text className='c-input-group-text'>Погрешность</InputGroup.Text>
                                            <Delim />
                                            <Form.Control id='precision' required type='number' value={isNaN(dataType.precision) ? '' : dataType.precision} readOnly={!edit} onChange={changeNumber} />
                                        </InputGroup>
                                        <InputGroup className='mb-3 shadow-sm rounded-2'>
                                            <InputGroup.Text className='c-input-group-text'>Описание</InputGroup.Text>
                                            <Delim />
                                            <Form.Control style={{ height: 90 }} as="textarea" id='description' required value={dataType.description} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-3 shadow-sm rounded-2'>
                                            <InputGroup.Text className='c-input-group-text'>Ед. изм.</InputGroup.Text>
                                            <Delim />
                                            <Form.Control id='unit' required value={dataType.unit} readOnly={!edit} onChange={changeString} />
                                        </InputGroup>
                                        <InputGroup className='mb-3 shadow-sm rounded-2'>
                                            <InputGroup.Text className='c-input-group-text'>Статус</InputGroup.Text>
                                            <Delim />
                                            <Form.Control id='data_type_status' required value={dataType.data_type_status} readOnly={true} />
                                        </InputGroup>
                                        <Form.Group className="mb-3 shadow-sm rounded-2 text-center">
                                            <Form.Label>Выберите изображение</Form.Label>
                                            <Form.Control
                                                disabled={!edit}
                                                type="file"
                                                accept='image/*'
                                                ref={inputFile}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                        </Form.Group>
                                    </Card.Body>
                                    {edit ? (
                                        <ButtonGroup className='w-75 mx-3 px-0 shadow-sm'>
                                            <Button key='submit-edited' variant='success' type="submit">✅</Button>
                                            {data_type_id != 'new' && <Button key='drop-changes' variant='danger' onClick={cancel}>🚫</Button>}
                                        </ButtonGroup>
                                    ) : (
                                        <ButtonGroup className='w-75 mx-3 px-0 shadow-sm'>
                                            <Button
                                                key='allow-edit'
                                                className='w-50'
                                                variant='outline-dark'
                                                onClick={() => setEdit(true)}>
                                                ✏️
                                            </Button>
                                            <Delim />
                                            <Button
                                            className='w-50'
                                            variant='outline-danger'
                                            onClick={useDeleteDataType}>
                                                Удалить
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого контейнера не существует</h3>
            )}
        </LoadAnimation >
    )
}

export default DataTypeEdit
