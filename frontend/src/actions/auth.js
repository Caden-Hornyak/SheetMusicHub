import axios from '../configs/axiosConfig';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL
} from './types';
import Cookies from 'js-cookie'

export const register = (username, password, re_password) => async dispatch => {


    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({ username, password, re_password });

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/register/`, body, config);

        
        if (res.data.error) {
            dispatch({
                type: REGISTER_FAIL
            });
        } else {
            dispatch({
                type: REGISTER_SUCCESS
            })
        }
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

export const login = (username, password) => async dispatch => {


    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        withCredentials: true
    };

    const body = JSON.stringify({ username, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/login/`, body, config);

        
        if (res.data.error) {
            dispatch({
                type: LOGIN_FAIL
            });
        } else {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data.username
            })
        }
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

export const logout = () => async dispatch => {


    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({
        'withCredentials': true
    })

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/logout/`, body, config);

        
        
        if (res.data.error) {
            dispatch({
                type: LOGOUT_FAIL
            });
        } else {
            dispatch({
                type: LOGOUT_SUCCESS,
            })
        }
    } catch (err) {
        dispatch({
            type: LOGOUT_FAIL
        });
    }
}