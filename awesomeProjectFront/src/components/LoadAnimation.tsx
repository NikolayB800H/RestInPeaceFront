import Spinner from 'react-bootstrap/Spinner';
import { ReactNode, FC } from 'react'

interface InterfaceLoadAnimationProps {
    children: ReactNode;
    loaded: Boolean;
}

export const LoadAnimation: FC<InterfaceLoadAnimationProps> = ({ children, loaded }) => {
    return loaded ? (
        <>{children}</>
    ) : (
        <div className='position-absolute top-50 start-50 translate-middled-flex justify-content-center'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Загрузка...</span>
            </Spinner>
        </div>
    );
};

export default LoadAnimation;
