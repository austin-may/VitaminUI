import React, { useState, useEffect, useReducer, Reducer, useContext } from "react";
import { Select, FormControl, InputLabel, Container } from "@material-ui/core";
import InventoryItem from "./inventory-item";
import InventorySearchBar from "./inventory-search-bar";
import { InventoryProvider, InventoryContext } from "./inventory-context";
import { InventoryImage } from "../../models/inventory-models";
import { connect } from 'react-redux';
import * as inventoryActions from '../../redux/actions/inventory-actions';
import * as actionTypes from '../../redux/actions/actionTypes';
import { inventoryReducer } from "../../redux/reducers/inventory-reducers";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'

let count = 0;
function Inventory(props) {

    console.log('yerr');
    if (count === 0) {
        props.actions.loadInventory();

    }
    count++;
    console.log(count);
    const [searchQuery, setSearchQuery] = useState("");

    //dispatch is a good generic term for managing state on multiple state objects
    // const [{ inventory, status, error }, dispatch] = useReducer(inventoryReducer, {
    //     status: actionTypes.REQUEST_STATUS.LOADING,
    //     inventory: [],
    //     error: null
    // });

    const isLoading = props.state.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.state.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.state.status === actionTypes.REQUEST_STATUS.ERROR;

    return (
        <Container maxWidth="lg">
            <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple">Site</InputLabel>
                <Select
                    native
                    label="Site"
                >
                    <option aria-label="None" value="" />
                    <option value={10}>Ansley Mall</option>
                    <option value={20}>Brookhaven</option>
                    <option value={30}>GA Tech Campus</option>
                </Select>
            </FormControl>
            <InventorySearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {isLoading && <div>Loading...</div>}

            {
                isSuccess && <div>SUCCESS</div> &&
                <InventoryComponent searchQuery={searchQuery}></InventoryComponent> &&
                Object.values(props.state.inventory).map((inventory: any) => (
                    <div key={inventory.Name}>{inventory.Name}</div>
                ))
            }
            {isError && <p>Error occured! {props.state.error}</p>}
        </Container>
    )
}

const InventoryComponent = (props: any) => {
    const { inventoryImages, inventory }: { inventoryImages: InventoryImage[], inventory: any } = useContext(InventoryContext);
    return (
        <div>
            {inventoryImages.filter((image: InventoryImage) => {
                return image.name.includes(props.searchQuery.toLowerCase()) && inventory.includes(image.name)
            })
                .map((inventoryImage: InventoryImage, i) => {
                    return <InventoryItem key={i} inventoryImage={inventoryImage} />
                })}
        </div>
    )
}

Inventory.propTypes = {
    dispatch: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
}

// Determines what state is passed to our component via props
function mapStateToProps(state) {
    console.log('my state is:', state.inventoryReducer);
    return {
        state: state.inventoryReducer
    }
}

// What actions we want to expose on our component
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(inventoryActions, dispatch) // bindActionCreators wraps ALL the actions in the dispatch call. Not just one
    }
}

//when we omit mapDispatchToProps, our component gets a dispatch prop injected automatically
// the "connect" api also connects our component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
