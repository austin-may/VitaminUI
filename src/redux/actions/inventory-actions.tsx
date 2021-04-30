import * as actionTypes from './actionTypes';
import * as inventoryApi from '../../api/inventory-api';
import { store } from 'react-notifications-component';
import { InventoryConsumed, InventoryItem, SuppliedVitaminData } from '../../models/inventory-models';

const initialInventoryState = { Name: '', Count: 0 }


export function addInventorySuccess(inventoryState) {
    return { type: actionTypes.ADD_INVENTORY_SUCCESS, inventoryState };
}

export function addInventoryError(err) {
    return { type: actionTypes.ADD_INVENTORY_FAILURE, err };
}

export function getInventorySuccess(inventoryState) {
    return { type: actionTypes.LOAD_INVENTORY_SUCCESS, inventoryState }
}

export function getInventoryError(err) {
    return { type: actionTypes.LOAD_INVENTORY_FAILURE, err }
}

export function getNutritionConsumptionSuccess(inventoryState) {
    return { type: actionTypes.CONSUME_INVENTORY_SUCCESS, inventoryState }
}

export function getNutritionConsumptionError(err) {
    return { type: actionTypes.CONSUME_INVENTORY_FAILURE, err }
}

export function getNutritionByInventoryIdSuccess(inventoryState) {
    return { type: actionTypes.LOAD_NUTRITION_INFO_SUCCESS, inventoryState }
}

export function getNutritionByInventoryIdError(err) {
    return { type: actionTypes.LOAD_NUTRITION_INFO_FAILURE, err }
}

export function loadVitaminSuccess(inventoryState) {
    return { type: actionTypes.LOAD_VITAMINS_SUCCESS, inventoryState }
}

export function loadVitaminError(err) {
    return { type: actionTypes.LOAD_VITAMINS_FAILURE, err }
}

export function supplyVitaminSuccess(inventoryState) {
    return { type: actionTypes.SUPPLY_VITAMIN_DATA_SUCCESS, inventoryState }
}

export function supplyVitaminError(err) {
    return { type: actionTypes.SUPPLY_VITAMIN_DATA_FAILURE, err }
}


export function loadInventory() {
    return async function onLoad(dispatch) { //every thunk returns a function that accepts dispatch as an argument. Redux thunk injects dispatch so we don't have to.
        try {
            dispatch({ type: actionTypes.LOAD_INVENTORY, initialInventoryState })
            //sleep for 3 seconds to see Loading
            // await new Promise(resolve => {
            //     setTimeout(resolve, 1500)
            // })
            const response: any = await inventoryApi.getInventoryAsync()
            return onSuccess(response.data.data);
        } catch (error) {
            return onError(error);
        }
        function onSuccess(result) {
            dispatch(getInventorySuccess(result))
            store.addNotification({
                title: "Success!!!!!",
                message: "GET succeeded!",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        }
        function onError(error) {
            dispatch(getInventoryError(error))
            store.addNotification({
                title: "FAILURE!!!!!",
                message: "Inventory GET failed!",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        }
    }
}

export function addInventory(inventoryItem: InventoryItem) {
    return async function (dispatch) {
        try {
            dispatch({ type: actionTypes.ADD_INVENTORY, inventoryState: {} });
            const result = await inventoryApi.createInventoryAsync(inventoryItem);
            dispatch(addInventorySuccess(result))
        } catch (err) {
            dispatch(addInventoryError(err))
        }
    }
}

export function setSite(site: string) {
    return function (dispatch) {
        dispatch({ type: actionTypes.SET_SITE, inventoryState: site })
    }
}

export function consumeInventory(inventoryConsumed: InventoryConsumed[]) {
    return async function (dispatch) {
        try {
            dispatch({ type: actionTypes.CONSUME_INVENTORY, inventoryState: {} });
            const result = await inventoryApi.consumeInventoryAsync(inventoryConsumed);
            dispatch(getNutritionConsumptionSuccess(result))
        } catch (err) {
            dispatch(getNutritionConsumptionError(err))
        }
    }
}

export function loadNutritionInfo(inventoryId: number) {
    return async function (dispatch) {
        try {
            dispatch({ type: actionTypes.LOAD_NUTRITION_INFO, inventoryState: {} });
            const result = await inventoryApi.loadNutritionInfoByInventoryIdAsync(inventoryId);
            dispatch(getNutritionByInventoryIdSuccess(result))
        } catch (err) {
            dispatch(getNutritionByInventoryIdError(err))
        }
    }
}

export function loadVitamins() {
    return async function (dispatch) {
        try {
            dispatch({ type: actionTypes.LOAD_INVENTORY, inventoryState: {} });
            const result = await inventoryApi.loadVitamins();
            dispatch(loadVitaminSuccess(result));
        } catch (err) {
            dispatch(loadVitaminError(err))
        }
    }
}

export function supplyVitaminData(vitaminData: SuppliedVitaminData) {
    return async function (dispatch) {
        try {
            dispatch({ type: actionTypes.SUPPLY_VITAMIN_DATA, inventoryState: {} });
            const result = await inventoryApi.supplyVitaminToInventory(vitaminData);
            console.log('lehhhhhhhhhhh go!', result);
            dispatch(loadVitaminSuccess(result));
        } catch (err) {
            dispatch(loadVitaminError(err))
        }
    }
}