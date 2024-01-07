import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { axiosAPI } from "../api";
import { AppDispatch } from "../store";
import { setLogin as setLoginRedux, setRole } from "../store/userSlice";

const user_login = '/user/login';

interface JwtPayload {
    iss: string;
    exp: number;
    Role: number;
    login: string;
}

function parseJwt(token: string): JwtPayload {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

interface AuthResp {
    access_token: string;
    token_type: string;
}

const Authorization: FC = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();

    const useAuthorize = async (login: string, password: string): Promise<void> => {
        const response = await axiosAPI.post<AuthResp>(user_login, { login, password });
        const payload = parseJwt(response.data.access_token);
        let expires_at = new Date(payload.exp * 1000);
        localStorage.setItem('expires_at', expires_at.toISOString());
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('role', payload.Role.toString());
        localStorage.setItem('login', payload.login);
        dispatch(setLoginRedux(login));
        dispatch(setRole(payload.Role));
    }


    // TODO: Error handling? expires_in in redux
    const useHandleRegistration = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        useAuthorize(login, password)
            .then(() => navigate('/'))
    };

    return (
        <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
            <Form onSubmit={useHandleRegistration} className='d-flex flex-column align-items-center'>
                <h2>Вход</h2>

                <Form.Group controlId="login" className='d-flex flex-column align-items-center mt-2'>
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите ваш логин"
                        value={login}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password" className='d-flex flex-column align-items-center mt-1'>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Введите ваш пароль"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button
                    variant="dark"
                    type="submit"
                    className='mt-3 w-100'
                    disabled={!login || !password}
                >
                    Авторизироваться
                </Button>

                <Link to={'/registration'}>
                    <Button variant="link">
                        Перейти к регистрации
                    </Button>
                </Link>
            </Form>
        </Container>
    );
};

export default Authorization;
