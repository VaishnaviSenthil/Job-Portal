import axios from 'axios';
import { USER_SIGNIN_REQUEST,USER_SIGNIN_SUCCESS,USER_SIGNIN_FAIL, USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAIL, USER_LOAD_REQUEST, USER_LOAD_SUCCESS, USER_LOAD_FAIL, USER_APPLY_FAIL, USER_APPLY_SUCCESS, USER_APPLY_REQUEST, ALL_USER_LOAD_REQUEST, ALL_USER_LOAD_SUCCESS, ALL_USER_LOAD_FAIL, } from '../constants/userConstants';
import {toast} from 'react-toastify';

export const userSiginAction = (user) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST });
    try {
        const { data } = await axios.post("api/signin",user)
        localStorage.setItem("userInfo",JSON.stringify(data));
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        });
        toast.success("Login Successfull");
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.response.data.error
        });
        console.log(error);
       toast.error(error.response.data.error);
    }
}


// user Profile
//user profile action
export const userProfileAction = () => async (dispatch) => {
    dispatch({ type: USER_LOAD_REQUEST });
    try {
        const { data } = await axios.get("/api/userProfile");
        dispatch({
            type: USER_LOAD_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_LOAD_FAIL,
            payload: error.response.data.error
        });
        // toast.error(error.response.data.error);
    }
}



// logout action

export const userLogoutAction = () => async (dispatch) => {
    dispatch({ type: USER_LOGOUT_REQUEST });
    try {
        localStorage.removeItem('userInfo');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        const { data } = await axios.get("/api/logout");
        dispatch({
            type: USER_LOGOUT_SUCCESS,
            payload: data
        });
        toast.success("Log out successfully!");
    } catch (error) {
        dispatch({
            type: USER_LOGOUT_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}

// Apply Job
export const userJobApplyAction = (job) => async (dispatch) => {
    dispatch({ type: USER_APPLY_REQUEST });
    try {
        const { data } = await axios.post("/api/user/jobApply",job);
        dispatch({
            type: USER_APPLY_SUCCESS,
            payload: data
        });
        toast.success("Applied successfully")
    } catch (error) {
        dispatch({
            type: USER_APPLY_FAIL,
            payload: error.response.data.error,
           
        });
        toast.error(error.response.data.error);
    }
}


//all user action
export const allUserAction = () => async (dispatch) => {
    dispatch({ type: ALL_USER_LOAD_REQUEST });
    try {
        const { data } = await axios.get("/api/allusers");
        dispatch({
            type: ALL_USER_LOAD_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: ALL_USER_LOAD_FAIL,
            payload: error.response.data.error
        });
        toast.error(error.response.data.error);
    }
}