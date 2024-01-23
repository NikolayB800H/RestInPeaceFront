import { Button } from 'react-bootstrap';
import { forwardRef, ButtonHTMLAttributes, FC } from 'react';
import DatePicker from 'react-datepicker';
import { Delim } from '../components/Delim';

interface DatePickerProps {
    startDate:    Date | null | undefined;
    setStartDate: any;
    endDate:      Date | null | undefined;
    setEndDate:   any;
}

interface CustomInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value?:      string;
    onClick?:    (event: React.MouseEvent<HTMLButtonElement>) => void;
    myName:      string;
    classSuffix: string;
}

const DateTimePicker: FC<DatePickerProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
    const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>((props, ref) => {
        const { classSuffix, myName, ...rest } = props;
        console.log(myName);
        return (<Button
            variant="outline-dark"
            ref={ref}
            size="sm"
            className={"text-nowrap" + classSuffix}
            style={{ minWidth: '200px'}}
            {...rest}
        >
            {props.value ? props.value : myName}
        </Button>)
    });

    return (
    <div className="text-nowrap shadow-sm rounded-1">
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
            customInput={<CustomInput myName='Начало отрезка времени' classSuffix="rounded-left" />}
            className="text-nowrap"
        />
        <Delim />
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
            customInput={<CustomInput myName='Конец отрезка времени' classSuffix="rounded-right" />}
            className="text-nowrap"
        />
    </div>   
    );
};

export default DateTimePicker;
