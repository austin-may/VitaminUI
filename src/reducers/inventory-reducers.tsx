import { Reducer } from "react"
// import * as actionTypes from '../redux/actions/actionTypes';

// export const REQUEST_STATUS = {
//     LOADING: 'loading',
//     SUCCESS: 'success',
//     ERROR: 'error'
// }

// export const inventoryReducer: Reducer<any, any> = (state: any, action: any) => {
//     switch (action.type) {
//         case actionTypes.LOAD_INVENTORY_SUCCESS:
//         case 'GET_ALL_SUCCESS':
//             return {
//                 ...state,
//                 status: REQUEST_STATUS.SUCCESS,
//                 inventory: action.inventory
//             }
//         case 'UPDATE_STATUS':
//             return {
//                 ...state,
//                 status: action.status,
//                 error: action?.error
//             }
//         default:
//             return {
//                 ...state
//             }
//     }
// }