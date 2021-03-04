import React from "react";
import { useEffect, useReducer, useState } from "react";
import * as actionTypes from "../redux/actions/actionTypes";
import * as inventoryActions from '../redux/actions/inventory-actions'
import { InventoryImage } from "../models/inventory-models";
import { inventoryStore } from '../redux/reducers/inventory-reducers';

function useGetInventory() {
    const inventoryImages: InventoryImage[] = [
        {
            imageSrc: 'images/apple.jpg',
            name: 'apple'
        },
        {
            imageSrc: 'images/carrot.jpg',
            name: 'carrots'
        },
        {
            imageSrc: 'images/kale.jpg',
            name: 'kale'
        },
    ];

    const axios = require('axios');
    const signal = React.useRef(axios.CancelToken.source()); // use React.useRef to guarantee we still have reference to this cancellation token is not disposed of during the liftime of the component

    // dispatch is a good generic term for managing state on multiple state objects
    const [{ inventoryData, status, error }, dispatch] = useReducer(inventoryStore, {
        status: actionTypes.REQUEST_STATUS.LOADING,
        inventory: [],
        error: null
    });

    useEffect(() => {
        //inventoryActions.loadInventory();
        return () => {
            console.log('unmount and cancel any running axios request');
            signal.current.cancel();
        };
    }, [])

    const state = {
        inventoryImages,
        inventoryStore,
        status,
        error
    }

    return state;
}

export default useGetInventory;
