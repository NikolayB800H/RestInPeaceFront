import { Button } from 'react-bootstrap';
import { forwardRef, ButtonHTMLAttributes, FC } from 'react';
import DatePicker from 'react-datepicker';

interface DatePickerProps {
    /*selected: Date | null | undefined;
    onChange: any;*/
    startDate:    Date | null | undefined;
    setStartDate: any;
    endDate:      Date | null | undefined;
    setEndDate:   any;
}

interface CustomInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value?:   string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    myName:   string;
}

const DateTimePicker: FC<DatePickerProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
    const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>((props, ref) => {
        const { myName, ...rest } = props;
        console.log(myName);
        return (<Button
            variant="outline-dark"
            ref={ref}
            size="sm"
            className="text-nowrap"
            style={{ minWidth: '137px' }}
            {...rest}
        >
            {props.value ? props.value : myName}
        </Button>)
    });

    return (
    <>
        <DatePicker
            enableTabLoop={false}
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            startDate={startDate}
            endDate={endDate}
            timeFormat="HH:mm"
            timeIntervals={60}
            isClearable
            timeCaption="Время"
            dateFormat="HH:mm dd.MM.yyyy"
            customInput={<CustomInput myName='Начало периода' />}
            className="text-nowrap shadow-sm"
        />
        <DatePicker
            enableTabLoop={false}
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            startDate={startDate}
            endDate={endDate}
            timeFormat="HH:mm"
            timeIntervals={60}
            isClearable
            timeCaption="Время"
            dateFormat="HH:mm dd.MM.yyyy"
            customInput={<CustomInput myName='Конец периода' />}
            className="text-nowrap shadow-sm"
        />
    </>
        
    );/*(
        <DatePicker
            selected={selected}
            onChange={onChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            isClearable
            timeCaption="Время"
            dateFormat="HH:mm MM.d.yyyy"
            customInput={<CustomInput />}
            className="text-nowrap shadow-sm"
        />
    );*/
};

export default DateTimePicker;
