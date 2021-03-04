import { combineReducers } from 'redux';
import { inventoryStore } from './inventory-reducers';

const rootReducer = combineReducers({
    inventoryStore
});

export default rootReducer;