import { combineReducers } from 'redux';
import { inventoryReducer } from './inventory-reducers';

const rootReducer = combineReducers({
    inventoryReducer
});

export default rootReducer;