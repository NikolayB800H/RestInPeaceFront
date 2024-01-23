import React, { ReactNode } from 'react';
import { useSelector } from "react-redux";

import { RootState } from "../store";

interface InterfaceAuthCheckProps {
    children: ReactNode;
    allowedRoles: number[];
}

export const NOTAUTHORIZED = 0;
export const CLIENT = 1;
export const MODERATOR = 2;

const AuthCheck: React.FC<InterfaceAuthCheckProps> = ({ children, allowedRoles }) => {
    const userRole = useSelector((state: RootState) => state.user.role);

    return allowedRoles.includes(userRole) ? (
        <>{children}</>
    ) : (
        <h2 className="text-center position-absolute top-50 start-50 translate-middle">Для доступа к данной странице нужно авторизоваться</h2>
    );
};

export default AuthCheck;