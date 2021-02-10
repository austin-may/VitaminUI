import * as actionTypes from '../actions/actionTypes';
import { Reducer } from "react"

export const inventoryReducer: Reducer<any, any> = (state: any = {}, action: any = {}) => {
    switch (action.type) {
        case actionTypes.CREATE_INVENTORY:
            console.log(state, action);
            return [...state, { ...action.inventoryState.inventory }]
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