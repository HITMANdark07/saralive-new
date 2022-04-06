import { userActionTypes } from './user.types';

export const setCurrentUser = (user) => ({
        type: userActionTypes.SET_CURRENT_USER,
        payload: user 
})

export const setNotification = (data) => ({
        type:userActionTypes.SET_NOTIFICATION,
        payload:data
})