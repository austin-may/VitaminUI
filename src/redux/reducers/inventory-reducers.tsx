import * as actionTypes from '../actions/actionTypes';
import { Reducer } from "react"

export const inventoryReducer: Reducer<any, any> = (state: any = {}, action: any = {}) => {
    switch (action.type) {
        case actionTypes.ADD_INVENTORY:
            return {
                ...action,
                status: actionTypes.REQUEST_STATUS.LOADING
            }
        case actionTypes.ADD_INVENTORY_SUCCESS:
            console.log('state:', state);
            return {
                inventory: [],
                status: actionTypes.REQUEST_STATUS.SUCCESS
            }
        case actionTypes.LOAD_INVENTORY:
            return {
                inventory: action,
                status: actionTypes.REQUEST_STATUS.LOADING
            };
        case actionTypes.LOAD_INVENTORY_SUCCESS:
            return {
                inventory: action.inventoryState.inventory,
                status: actionTypes.REQUEST_STATUS.SUCCESS
            };
        case actionTypes.ADD_INVENTORY_FAILURE:
        case actionTypes.LOAD_INVENTORY_FAILURE:
            return {
                error: action.err,
                status: actionTypes.REQUEST_STATUS.ERROR
            };
        default:
            return {
                inventory: action
            }
    }
}