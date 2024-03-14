import axios from '../configs/axiosConfig';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    
} from './types';
import Cookies from 'js-cookie'
import { load_user } from './profile';

export const checkAuthenticated = () => async dispatch => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/accounts/check-authenticated/`, config);

        if (res.data.error) {

            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false
            });
        } else {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
                payload: true
            });
        }

    } catch (err) {
        dispatch({
            type: AUTHENTICATED_FAIL,
            payload: false
        });
    }
}

export const register_normal_pass = (username, password, re_password) => async dispatch => {
    console.log('normal pass')

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({ username, password, re_password });

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/register/normal`, body, config);

        
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

export const register_piano_pass = (username, piano_password) => async dispatch => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({ username, piano_password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/register/piano`, body, config);

        
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

export const login_normal = (username, password) => async dispatch => {


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
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/login/normal`, body, config);
        
        if (res.data.error) {
            dispatch({
                type: LOGIN_FAIL
            });
        } else {
            dispatch({
                type: LOGIN_SUCCESS
            });

            load_user();
        }
    } catch (err) {
        console.log(err)
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

export const login_piano = (username, piano_password) => async dispatch => {


    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        withCredentials: true
    };

    const body = JSON.stringify({ username, piano_password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/accounts/login/piano`, body, config);

        
        if (res.data.error) {
            dispatch({
                type: LOGIN_FAIL
            });
        } else {
            dispatch({
                type: LOGIN_SUCCESS
            });

            load_user();
        }
    } catch (err) {
        console.log(err)
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


