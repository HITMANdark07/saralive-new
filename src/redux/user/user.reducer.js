import {userActionTypes} from './user.types';

const INITIAL_STATE = {
    currentUser:null,
    notification:false
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case userActionTypes.SET_CURRENT_USER :
            return {
                ...state,
                currentUser:action.payload,
            }
        case userActionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification:action.payload
            }
        default:
            return state;
    }
}

export default userReducer;