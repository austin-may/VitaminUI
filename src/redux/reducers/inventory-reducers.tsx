import * as actionTypes from '../actions/actionTypes';
import { Reducer } from "react"

const initialState = {
    inventory: [],
    site: 'All'
}

export const inventoryStore: Reducer<any, any> = (state: any = {}, action: any = {}) => {
    switch (action.type) {
        case actionTypes.ADD_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: [...state.inventory, { ...action.inventoryState.createInventory }],
                status: actionTypes.REQUEST_STATUS.SUCCESS
            }
        case actionTypes.LOAD_INVENTORY:
            return {
                ...state,
                inventory: [],
                status: actionTypes.REQUEST_STATUS.LOADING
            };
        case actionTypes.LOAD_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: action.inventoryState.inventory,
                status: actionTypes.REQUEST_STATUS.SUCCESS
            };
        case actionTypes.ADD_INVENTORY_FAILURE:
        case actionTypes.LOAD_INVENTORY_FAILURE:
            return {
                error: action.err,
                status: actionTypes.REQUEST_STATUS.ERROR
            };
        case actionTypes.SET_SITE:
            return {
                ...state,
                site: action.inventoryState
            };
        default:
            return initialState;
    }
}