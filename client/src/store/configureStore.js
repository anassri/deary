import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import user from './user';
import csrf from './csrf';
import post from './post';

const rootReducer = combineReducers({
    auth,
    user,
    csrf,
    post
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const storeEnhancer = composeEnhancers(applyMiddleware(thunk));

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, storeEnhancer);
}
