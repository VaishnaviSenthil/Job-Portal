import React from "react";
import { Route } from "react-router-dom";
// import UserNav from "../components/elements/usernav/UserNav";


const GuestRoute = ({ component: Component, ...rest }) => (
    <>
    {/* <UserNav/> */}
    <Route
        {...rest}
        render={props =>
                <Component {...props} />   
        }
    />
    </>
);

export default GuestRoute;
