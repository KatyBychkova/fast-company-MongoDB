import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../store/users";
function ProtectedRoute({ component: Component, children, ...rest }) {
    const isLoggedIn = useSelector(getIsLoggedIn());

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isLoggedIn) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    );
                }
                return Component ? <Component {...props} /> : children;
            }}
        />
    );
}
ProtectedRoute.propTypes = {
    component: PropTypes.func,
    location: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default ProtectedRoute;

// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import PropTypes from "prop-types";
// import { initializeUseSelector } from "react-redux/es/hooks/useSelector";
// import { getIsLoggedIn } from "../../store/users";
// function ProtectedRoute({ component: Component, children, ...rest }) {
//     const isLoggedIn = initializeUseSelector(getIsLoggedIn());
//     return (
//         <Route
//             {...rest}
//             render={(props) => {
//                 if (!isLoggedIn) {
//                     return (
//                         <Redirect
//                             /*
//                         pathname - роут, куда хотим переадресовать пользователя
//                         state- данные которые получаем в данный момент времени, которые нам нужно сохранить. У нас это страница с кот пришел пользователь
//                         Посмотреть можно в loginForm.jsx вывести history в консоль
//                         */
//                             to={{
//                                 pathname: "/login",
//                                 state: {
//                                     from: props.location
//                                 }
//                             }}
//                         />
//                     );
//                 }
//                 return Component ? <Component {...props} /> : children;
//             }}
//         />
//     );
// }
// ProtectedRoute.propTypes = {
//     component: PropTypes.func,
//     location: PropTypes.object,
//     children: PropTypes.oneOfType([
//         PropTypes.arrayOf(PropTypes.node),
//         PropTypes.node
//     ])
// };

// export default ProtectedRoute;
