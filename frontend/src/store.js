import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { userReducer, projectsReducer, tasksReducer } from './reducers';
const reducer = combineReducers({
    user: userReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));