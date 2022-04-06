import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from './user/user.reducer';
// import cartReducer from './cart/cart.reducer';

const persistConfig = {
    key: "root",
    storage:AsyncStorage,
    whitelist:['user']
}

const rootReducer = combineReducers({
    user: userReducer,
    // cart: cartReducer
})

export default persistReducer(persistConfig,rootReducer);