import axios from '../configs/axiosConfig';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';
import Cookies from 'js-cookie'

export const register = (username, password, re_password) => async dispatch => {

    const config = {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({ username, password, re_password });

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/register`, body, config);

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