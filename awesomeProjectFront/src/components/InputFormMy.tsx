import { useEffect, useState, PropsWithChildren} from 'react';
import { Col, InputGroup, Form, Button, } from 'react-bootstrap';
import { format, addDays } from "date-fns";
import { axiosAPI } from "../api";
import { Delim } from '../components/Delim';

interface InterfaceInputFormPropsPrep {
    input_first: number | null
    input_second: number | null
    input_third: number | null
    output: number | null
    data_type_id: string
    input_start_date: Date | null
    application_status: string
    upper_should_not_send: number
    set_upper_should_not_send: any
    get_data: any
}

const InputFormMy = ({ children, input_first, input_second, input_third, output, data_type_id, input_start_date, application_status, upper_should_not_send, set_upper_should_not_send, get_data }: PropsWithChildren<InterfaceInputFormPropsPrep>) => {
    console.log(children);
    const [editInputs, setEditInputs] = useState(false);
    const [inputFirst, setInputFirst] = useState<number | null>(input_first);
    const [inputSecond, setInputSecond] = useState<number | null>(input_second);
    const [inputThird, setInputThird] = useState<number | null>(input_third);
    const [tempInputFirst, setTempInputFirst] = useState<number | null>(null);
    const [tempInputSecond, setTempInputSecond] = useState<number | null>(null);
    const [tempInputThird, setTempInputThird] = useState<number | null>(null);
    const [shouldNotSend, setShouldNotSend] = useState(false);
    const [shouldNotSendPrev, setShouldNotSendPrev] = useState(false);

    useEffect(() => {
        const tmp = (inputFirst === null || inputSecond === null || inputThird === null);
        setShouldNotSend(tmp);
        setShouldNotSendPrev(tmp);
        if (tmp) {
            set_upper_should_not_send(upper_should_not_send + 1);
        }
    }, []);

    useEffect(() => {
        setShouldNotSend(inputFirst === null || inputSecond === null || inputThird === null);
    }, [inputFirst, inputSecond, inputThird]);

    useEffect(() => {
        if (!editInputs && (shouldNotSendPrev !== shouldNotSend)) {
            if (shouldNotSend) {
                set_upper_should_not_send(upper_should_not_send + 1);
                setShouldNotSendPrev(true);
            } else {
                set_upper_should_not_send(upper_should_not_send - 1);
                setShouldNotSendPrev(false);
            }
        }
    }, [editInputs]);

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
            .then(() => get_data())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEditInputs(false);
    }

    return (
        <Col className='card shadow-sm px-3 pt-1 pb-2'>
            <InputGroup className='mb-3 shadow-sm rounded-2'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Изм.${(input_start_date ? format(input_start_date, "dd-MM-yyyy") : ' день 1')}`}</InputGroup.Text>
                <Delim />
                <Form.Control
                    placeholder='1.0, например'
                    type='number'
                    readOnly={!editInputs}
                    value={inputFirst ? String(inputFirst) : ''}
                    onChange={(e) => setInputFirst(parseFloat(e.target.value))}
                />
            </InputGroup>
            <InputGroup className='mb-3 shadow-sm rounded-2'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Изм.${(input_start_date ? format(addDays(input_start_date, 1), "dd-MM-yyyy") : ' день 2')}`}</InputGroup.Text>
                <Delim />
                <Form.Control
                    placeholder='2.0, например'
                    type='number'
                    readOnly={!editInputs}
                    value={inputSecond ? String(inputSecond) : ''}
                    onChange={(e) => setInputSecond(parseFloat(e.target.value))}
                />
            </InputGroup>
            <InputGroup className='mb-3 shadow-sm rounded-2'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Изм.${(input_start_date ? format(addDays(input_start_date, 2), "dd-MM-yyyy") : ' день 3')}`}</InputGroup.Text>
                <Delim />
                <Form.Control
                    placeholder='3.0, например'
                    type='number'
                    readOnly={!editInputs}
                    value={inputThird ? String(inputThird) : ''}
                    onChange={(e) => setInputThird(parseFloat(e.target.value))}
                />
            </InputGroup>
            {application_status !== 'черновик' && <InputGroup className='shadow-sm rounded-2'>
                <InputGroup.Text className='px-2 w-50 t-input-group-text'>{`Отв.${(input_start_date ? format(addDays(input_start_date, 3), "dd-MM-yyyy") : ' день 4')}`}</InputGroup.Text>
                <Delim />
                <Form.Control
                    readOnly={true}
                    value={output ? output.toFixed(1) : 'Обнови...'}
                />
            </InputGroup>}
            <InputGroup className='container align-content-center d-flex justify-content-center'>
                {!editInputs && application_status === 'черновик' && <Button variant='outline-dark' className='shadow-sm m-0' onClick={() => {
                        setTempInputFirst(inputFirst);
                        setTempInputSecond(inputSecond);
                        setTempInputThird(inputThird);
                        setEditInputs(true)
                    }}>
                    ✏️
                </Button>}
                {editInputs && <Button
                    disabled={shouldNotSend}
                    variant='success'
                    className='shadow-sm m-0'
                    onClick={useSetInput(data_type_id, inputFirst, inputSecond, inputThird)}>
                    {!shouldNotSend && <div className='p-0 m-0'>✅</div>}
                    {shouldNotSend && <s>✅</s>}
                </Button>}
                {editInputs && <Button
                    variant='danger'
                    className='shadow-sm m-0'
                    onClick={() => {
                        setInputFirst(tempInputFirst);
                        setInputSecond(tempInputSecond);
                        setInputThird(tempInputThird);
                        setEditInputs(false)
                    }}>
                    🚫
                </Button>}
            </InputGroup>
        </Col>
    )
};

export default InputFormMy;
