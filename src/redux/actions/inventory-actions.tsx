import * as actionTypes from './actionTypes';
import * as inventoryApi from '../../api/inventory-api';
import { store } from 'react-notifications-component';
import { InventoryConsumed, InventoryItem } from '../../models/inventory-models';

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

export function getNutritionSuccess(inventoryState) {
    return { type: actionTypes.CONSUME_INVENTORY_SUCCESS, inventoryState }
}

export function getNutritionError(err) {
    return { type: actionTypes.CONSUME_INVENTORY_FAILURE, err }
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
            dispatch(getNutritionSuccess(result))
        } catch (err) {
            dispatch(getNutritionError(err))
        }
    }
}