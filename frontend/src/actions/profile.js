import axios from '../configs/axiosConfig'
import Cookies from 'js-cookie'
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL
} from './types'

export const load_user = () => async dispatch => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/get-profile/`, config)

        if (res.data.error) {
            dispatch({
                type: LOAD_USER_PROFILE_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_USER_PROFILE_SUCCESS,
                payload: res.data
            })
        }

    } catch (err) {
        dispatch({
            type: LOAD_USER_PROFILE_FAIL,
        })
    }
}

export const update_user = (first_name, last_name) => async dispatch => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({ first_name, last_name })

    try {

        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/get-profile/`, config)

        if (res.data.error) {
            dispatch({
                type: LOAD_USER_PROFILE_FAIL,
            })
        } else {
            dispatch({
                type: LOAD_USER_PROFILE_SUCCESS,
                payload: res.data
            })
        }

    } catch (err) {
        dispatch({
            type: LOAD_USER_PROFILE_FAIL,
        })
    }
}