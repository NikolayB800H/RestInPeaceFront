import { FC } from 'react'
import { Button } from 'react-bootstrap';

interface InterfaceDelimProps {
    className?: string
}

export const Delim: FC<InterfaceDelimProps> = ({ className }) => (
    <Button
        disabled={true}
        variant='secondary'
        className={'m-0 px-6 ' + className}>
    </Button>
);