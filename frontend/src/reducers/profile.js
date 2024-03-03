import { 
    LOAD_USER_PROFILE_FAIL,
    LOAD_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
    I_WAS_RAN_FIRST
} from '../actions/types';

const initialState = {
    username: '',
    first_name: '',
    last_name: ''
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case LOAD_USER_PROFILE_SUCCESS:
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                username: payload.username,
                first_name: payload.profile.first_name,
                last_name: payload.profile.last_name
            }
        case LOAD_USER_PROFILE_FAIL:
            return {
                ...state,
                username: '',
                first_name: '',
                last_name: ''
            }
        case UPDATE_USER_PROFILE_FAIL:
        case I_WAS_RAN_FIRST:
            return state
        default:
            return state
    }
}