import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { axiosAPI } from '../api';
import { AppDispatch, RootState } from "../store";
import { resetLogin, resetRole } from "../store/userSlice";
import { reset } from "../store/searchSlice";
import { MODERATOR } from "./AuthCheck";

function NavigationBar() {
    const userLogin = useSelector((state: RootState) => state.user.login);
    const dispatch = useDispatch<AppDispatch>();
    const userRole = useSelector((state: RootState) => state.user.role);

    const logout = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.get('/user/logout', { headers: { 'Authorization': `Bearer${accessToken}` } })
            .then(_ => {
                dispatch(resetLogin())
                dispatch(resetRole())
                dispatch(reset())
                localStorage.clear()
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    return (
        <Navbar expand="sm" className='bg-dark py-0' data-bs-theme="dark">
            <div className='container-xl px-2 px-sm-3'>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto flex-grow-1">
                        <Link to="/data_types" className="nav-link">Виды данных</Link>
                        <Link to="/forecast_applications" className="nav-link">Запросы на прогнозы</Link>
                        {userRole === MODERATOR && <Link to="/data_types-edit" className="nav-link text-nowrap">Управление видами данных</Link>}
                        <Navbar.Collapse className="justify-content-end">
                            {userLogin ? (
                                <>
                                    <Navbar.Text className="px-sm-2">
                                        {userLogin}
                                    </Navbar.Text>
                                    <Navbar.Text className="d-none d-sm-block">|</Navbar.Text>
                                    <Button
                                        variant="link"
                                        className="nav-link"
                                        onClick={logout}>
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to='/authorization' className="nav-link">Войти</Link>
                                    <Navbar.Text className="d-none d-sm-block">|</Navbar.Text>
                                    <Link to='/registration' className="nav-link">Регистрация</Link>
                                </>
                            )}
                        </Navbar.Collapse>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;