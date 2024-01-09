import { useEffect, useState, FC } from 'react';
import { Col, InputGroup, Form, Button, } from 'react-bootstrap';
import { format, addDays } from "date-fns";
import { axiosAPI } from "../api";

interface InterfaceInputFormProps {
    input_first: number | null
    input_second: number | null
    input_third: number | null
    output: number | null
    data_type_id: string
    input_start_date: Date | null
    application_status: string
    children: React.ReactNode
}

const InputFormMy: FC<InterfaceInputFormProps> = ({ input_first, input_second, input_third, output, data_type_id, input_start_date, application_status, children }) => {
    const [editInputs, setEditInputs] = useState(false);
    const [inputFirst, setInputFirst] = useState<number | null>(input_first);
    const [inputSecond, setInputSecond] = useState<number | null>(input_second);
    const [inputThird, setInputThird] = useState<number | null>(input_third);
    const [tempInputFirst, setTempInputFirst] = useState<number | null>(null);
    const [tempInputSecond, setTempInputSecond] = useState<number | null>(null);
    const [tempInputThird, setTempInputThird] = useState<number | null>(null);
    const [shouldNotSend, setShouldNotSend] = useState(false)

    useEffect(() => {
        setShouldNotSend(inputFirst === null || inputSecond === null || inputThird === null);
    });

    const useSetInput = (
        id: string,
        inputFirst: number | null,
        inputSecond: number | null,
        inputThird: number | null,
    ) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken || shouldNotSend) {
            return
        }
        let bodyFormData = new FormData();
        bodyFormData.append('input_first', inputFirst ? String(inputFirst) : '');
        bodyFormData.append('input_second', inputSecond ? String(inputSecond) : '');
        bodyFormData.append('input_third', inputThird ? String(inputThird) : '');
        axiosAPI.put(`/forecast_applications/set_input/${id}`, bodyFormData, {
                headers: {
                    Authorization: `Bearer${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {})
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEditInputs(false);
    }

    return (
        <Col className='p-3 pt-1 px-0'>
            <InputGroup className='mb-1'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Измер.${(input_start_date ? format(input_start_date, "dd-MM-yyyy") : ' день 1')}`}</InputGroup.Text>
                <Form.Control
                    type='number'
                    readOnly={!editInputs}
                    value={inputFirst ? String(inputFirst) : ''}
                    onChange={(e) => setInputFirst(parseFloat(e.target.value))}
                />
            </InputGroup>
            <InputGroup className='mb-1'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Измер.${(input_start_date ? format(addDays(input_start_date, 1), "dd-MM-yyyy") : ' день 2')}`}</InputGroup.Text>
                <Form.Control
                    type='number'
                    readOnly={!editInputs}
                    value={inputSecond ? String(inputSecond) : ''}
                    onChange={(e) => setInputSecond(parseFloat(e.target.value))}
                />
            </InputGroup>
            <InputGroup className='mb-1'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Измер.${(input_start_date ? format(addDays(input_start_date, 2), "dd-MM-yyyy") : ' день 3')}`}</InputGroup.Text>
                <Form.Control
                    type='number'
                    readOnly={!editInputs}
                    value={inputThird ? String(inputThird) : ''}
                    onChange={(e) => setInputThird(parseFloat(e.target.value))}
                />
            </InputGroup>
            <InputGroup className='mb-1'>
                {application_status !== 'черновик' && <InputGroup className='mb-1'>
                    <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Ответ.${(input_start_date ? format(addDays(input_start_date, 3), "dd-MM-yyyy") : ' день 4')}`}</InputGroup.Text>
                    <Form.Control
                        readOnly={true}
                        value={output ? output.toFixed(1) : 'Обнови страницу'}
                    />
                </InputGroup>}
                {!editInputs && application_status === 'черновик' && <Button variant='dark' onClick={() => {
                        setTempInputFirst(inputFirst);
                        setTempInputSecond(inputSecond);
                        setTempInputThird(inputThird);
                        setEditInputs(true)
                    }}>
                    ✏️
                </Button>}
                {editInputs && <Button
                    variant='success'
                    onClick={useSetInput(data_type_id, inputFirst, inputSecond, inputThird)}>
                    ✅
                </Button>}
                {editInputs && <Button
                    variant='danger'
                    onClick={() => {
                        setInputFirst(tempInputFirst);
                        setInputSecond(tempInputSecond);
                        setInputThird(tempInputThird);
                        setEditInputs(false)
                    }}>
                    ❌
                </Button>}
            </InputGroup>
        </Col>
    )
};

export default InputFormMy;
