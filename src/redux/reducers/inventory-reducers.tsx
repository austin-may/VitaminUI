import * as actionTypes from '../actions/actionTypes';
import { Reducer } from "react"

const initialState = {
    inventory: [],
    site: 'All',
    vitaminNutritionFacts: [],
    nutritionInfoData: [],
    vitamins: []
}

export const inventoryStore: Reducer<any, any> = (state: any = {}, action: any = {}) => {
    switch (action.type) {
        case actionTypes.ADD_INVENTORY:
            return {
                ...state,
                inventory: [...state.inventory],
                status: actionTypes.REQUEST_STATUS.LOADING
            }
        case actionTypes.ADD_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: [...state.inventory, { ...action.inventoryState.createInventory }],
                status: actionTypes.REQUEST_STATUS.SUCCESS
            }
        case actionTypes.CONSUME_INVENTORY:
            return {
                ...state,
                status: actionTypes.VITAMIN_REQUEST_STATUS.LOADING
            }
        case actionTypes.CONSUME_INVENTORY_SUCCESS:
            return {
                ...state,
                vitaminNutritionFacts: action.inventoryState.vitaminNutritionFacts,
                status: actionTypes.VITAMIN_REQUEST_STATUS.SUCCESS
            }
        case actionTypes.LOAD_NUTRITION_INFO:
            return {
                ...state,
                status: actionTypes.VITAMIN_REQUEST_STATUS.LOADING
            }
        case actionTypes.LOAD_NUTRITION_INFO_SUCCESS:
            return {
                ...state,
                nutritionInfoData: action.inventoryState.nutritionFactsByInventoryId,
                status: actionTypes.VITAMIN_REQUEST_STATUS.SUCCESS
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
        case actionTypes.LOAD_VITAMINS:
            return {
                ...state,
                vitamins: [],
                status: actionTypes.REQUEST_STATUS.LOADING
            };
        case actionTypes.LOAD_VITAMINS_SUCCESS:
            return {
                ...state,
                vitamins: action.inventoryState.vitamins,
                status: actionTypes.REQUEST_STATUS.SUCCESS
            };
        case actionTypes.CONSUME_INVENTORY_FAILURE:
        case actionTypes.ADD_INVENTORY_FAILURE:
        case actionTypes.LOAD_INVENTORY_FAILURE:
        case actionTypes.LOAD_VITAMINS_FAILURE:
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