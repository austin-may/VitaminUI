import * as actionTypes from './actionTypes';
import * as inventoryApi from '../../api/inventory-api';
import { store } from 'react-notifications-component';

const initialInventoryState = { Name: '', Count: 0 }

export function createInventory(inventoryState) {
    return { type: actionTypes.CREATE_INVENTORY, inventoryState };
}

export function getInventory() {
    return { type: actionTypes.LOAD_INVENTORY, initialInventoryState }
}

export function getInventorySuccess(inventoryState) {
    return { type: actionTypes.LOAD_INVENTORY_SUCCESS, inventoryState }
}


export function getInventoryError(err) {
    return { type: actionTypes.LOAD_INVENTORY_FAILURE, err }
}

function delay() {

}


export function loadInventory() {
    return async function onLoad(dispatch) { //every thunk returns a function that accepts dispatch as an argument. Redux thunk injects dispatch so we don't have to.
        try {
            dispatch(getInventory())
            //sleep for 3 seconds to see Loading
            await new Promise(resolve => {
                setTimeout(resolve, 1500)
            })
            const response: any = await inventoryApi.getInventoryAsync()
            console.log(response.data.data);
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