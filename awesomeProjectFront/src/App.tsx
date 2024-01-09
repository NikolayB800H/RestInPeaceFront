import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { DataTypes, DataTypeInfo, ForecastApps, ForecastAppInfo, Authorization, Registration, DataTypesTable, DataTypeEdit } from './pages'
import NavigationBar from './components/NavBar';
import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";
import AuthCheck, { CLIENT, MODERATOR } from './components/AuthCheck';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/data_types" />} />
          <Route path="/data_types" element={<DataTypes />} />
          <Route path="/data_types/:data_type_id" element={<DataTypeInfo />} />
          <Route path="/data_types-edit" element={<AuthCheck allowedRoles={[MODERATOR]}><DataTypesTable /></AuthCheck>} />
          <Route path="/data_types-edit/:data_type_id" element={<AuthCheck allowedRoles={[MODERATOR]}><DataTypeEdit /></AuthCheck>} />

          <Route path="/forecast_applications" element={<AuthCheck allowedRoles={[CLIENT, MODERATOR]}><ForecastApps /></AuthCheck>} />
          <Route path="/forecast_applications/:application_id" element={<AuthCheck allowedRoles={[CLIENT, MODERATOR]}><ForecastAppInfo /></AuthCheck>} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
