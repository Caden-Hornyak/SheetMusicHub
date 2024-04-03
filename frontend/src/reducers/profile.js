import { 
    LOAD_USER_PROFILE_FAIL,
    LOAD_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
} from '../actions/types'

const initialState = {
    user_profile: {
        username: '',
        first_name: '',
        last_name: '',
        profile_picture: '', 
        piano_password: false
    }
    
}

export default function(state = initialState, action) {
    const { type, payload } = action

    switch(type) {
        case LOAD_USER_PROFILE_SUCCESS:
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                user_profile: {
                    username: payload.username,
                    first_name: payload.profile.first_name,
                    last_name: payload.profile.last_name,
                    profile_picture: payload.profile.profile_picture,
                    piano_password: payload.profile.piano_password
                }
            }
        case LOAD_USER_PROFILE_FAIL:
            return {
                ...state,
                user_profile: {
                    username: '',
                    first_name: '',
                    last_name: '',
                    user_profile: '',
                    piano_password: false
                }
                
            }
        case UPDATE_USER_PROFILE_FAIL:
            return state
        default:
            return state
    }
}