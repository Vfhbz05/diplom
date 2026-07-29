import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { userReducer, appReducer, projectsReducer, tasksReducer } from './reducers';
const reducer = combineReducers({
    user: userReducer,
    app: appReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));