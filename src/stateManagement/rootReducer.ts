// rootReducer.ts
import { combineReducers } from 'redux';
import NetworkViewReducer from './reducer';

const rootReducer = combineReducers({
    networkReducer: NetworkViewReducer
});

export default rootReducer;
