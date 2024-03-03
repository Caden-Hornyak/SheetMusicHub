import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL
} from '../actions/types';

const initialState = {
    isAuthenticated: null
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        
        default:
            return state
    }
}