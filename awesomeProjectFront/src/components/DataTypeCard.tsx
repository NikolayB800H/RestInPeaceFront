import { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';
import { InterfaceDataTypeProps } from '../models';

interface InterfaceCardProps extends InterfaceDataTypeProps {
    children: ReactNode;
}

export const SmallDataTypeCard: FC<InterfaceCardProps> = ({ children, data_type_id, image_path, data_type_name, precision, unit }) => {
    const navigate = useNavigate();
    return (
    <Card className='w-100 mx-auto px-3 pt-1 pb-2 shadow-sm text-center'>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_path} className='rounded object-fit-cover'/>
        </div>
        <Card.Body className='flex-grow-1 pb-1 pt-1'>
            <Card.Title className='mb-0' as="h6">Прогноз {data_type_name} (в {unit})</Card.Title>
            <Card.Text>Погрешность ±{precision} {unit}</Card.Text>
        </Card.Body>
        <ButtonGroup className='mt-0 shadow-sm d-flex p-0 justify-content-center rounded-2' vertical>
            <Button
                variant="outline-dark"
                className='mt-0'
                onClick={() => {navigate(`/data_types/${data_type_id}`)}}>
                Подробнее о прогнозе
            </Button>
            <>{children}</>
        </ButtonGroup>
    </Card>)
}

export const BigDataTypeCard: FC<InterfaceDataTypeProps> = ({ image_path, data_type_name, precision, unit, description }) => (
    <Card className='shadow-sm text-center text-md-start'>
        <div className='row'>
            <div className='col-12 col-md-7 overflow-hidden my-5'>
                <CardImage url={image_path}/>
            </div>
            <Card.Body className='col-12 col-md-4 ps-md-0'>
                <ListGroup variant="flush" className="rounded-2 my-4 mx-5 shadow-sm">
                    <ListGroup.Item>
                        <Card.Title className="fs-4">Прогноз {data_type_name} (в {unit})</Card.Title>
                        <Card.Text className="fw-lighter">Погрешность ±{precision} {unit}</Card.Text>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Card.Text className="fst-italic">Описание: {description}</Card.Text>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </div>
    </Card>
);