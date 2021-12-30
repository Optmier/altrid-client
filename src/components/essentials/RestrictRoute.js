/** Refered
 * https://jeonghwan-kim.github.io/dev/2020/03/20/role-based-react-router.html
 */

import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import ErrorRestricted from '../../pages/Errors/ErrorRestricted';

const RestrictRoute = ({ role, allowedTypes, component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                // 권한 체크
                if (!allowedTypes.includes(role)) {
                    return <ErrorRestricted />;
                }

                if (Component) {
                    // role을 컴포넌트에 전달
                    return <Component {...props} role={role} />;
                }

                return null;
            }}
        />
    );
};

RestrictRoute.defaultProps = {
    role: '',
    allowedTypes: [],
    component: FC,
};

export default RestrictRoute;
