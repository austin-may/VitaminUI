import React, { useEffect, useReducer } from "react";
import { bindActionCreators } from "redux";
import { GET_ALL_SUCCESS, UPDATE_STATUS } from "../../actions/inventory-actions";
import useGetInventory from "../../hooks/useGetInventory";
import { InventoryImage } from "../../models/inventory-models";
import InventoryItem from "./inventory-item";
import { connect } from 'react-redux';
import * as inventoryActions from '../../redux/actions/inventory-actions';


const InventoryContext = React.createContext<any>([]);

const InventoryProvider = ({ children }: any) => {

    const state = useGetInventory();

    return (
        <InventoryContext.Provider value={state}>
            {children}
        </InventoryContext.Provider>
    )

}

export { InventoryContext, InventoryProvider }
