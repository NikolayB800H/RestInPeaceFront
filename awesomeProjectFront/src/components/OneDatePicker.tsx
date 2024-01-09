import { Button } from 'react-bootstrap';
import { forwardRef, ButtonHTMLAttributes, FC } from 'react';
import DatePicker from 'react-datepicker';

interface DatePickerProps {
    disabled: boolean;
    selected: Date | null | undefined;
    onChange: any;
}

interface CustomInputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value?:   string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const OneDatePicker: FC<DatePickerProps> = ({ disabled, selected, onChange }) => {
    const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>((props, ref) => {
        return (<Button
            disabled={props.disabled}
            variant="outline-dark"
            ref={ref}
            size="sm"
            className="w-100 text-nowrap"
            {...props}
        >
            {props.value ? props.value : 'Тык'}
        </Button>)
    });

    return (
        <DatePicker
            enableTabLoop={false}
            disabled={disabled}
            selected={selected}
            onChange={onChange}
            dateFormat="dd.MM.yyyy"
            customInput={<CustomInput />}
            className="p-2 text-nowrap shadow-sm"
        />
    );
};

export default OneDatePicker;
