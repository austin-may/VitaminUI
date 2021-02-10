import React, { useState, useEffect, useReducer, Reducer, useContext } from "react";
import { Select, FormControl, InputLabel, Container, Button, Input } from "@material-ui/core";
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

function Inventory(props) {
    const { loadInventory, addInventory } = props;
    useEffect(() => {
        loadInventory();
    }, []); //This array is an array of items to watch, and it it changes it will rerender again.
    //Otherwise, with the empty array as a second argument to effect means the effect will run only once when the component mounts.

    const [searchQuery, setSearchQuery] = useState("");
    const [inventoryToAdd, setInventoryToAdd] = useState('')

    //dispatch is a good generic term for managing state on multiple state objects
    // const [{ inventory, status, error }, dispatch] = useReducer(inventoryReducer, {
    //     status: actionTypes.REQUEST_STATUS.LOADING,
    //     inventory: [],
    //     error: null
    // });

    const isLoading = props.state.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.state.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.state.status === actionTypes.REQUEST_STATUS.ERROR;

    function handleAdd(event) {
        event.preventDefault();
        addInventory(inventoryToAdd);
    }

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
            <Input type='text' placeholder='Type inventory to add' value={inventoryToAdd}
                onChange={(e) => setInventoryToAdd(e.target.value)} />
            <Button onClick={handleAdd}>Add Inventory</Button>
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
    loadInventory: PropTypes.func.isRequired
}

// Determines what state is passed to our component via props
function mapStateToProps(state) {
    return {
        state: state.inventoryReducer
    }
}

// What actions we want to expose on our component
const mapDispatchToProps = {
    loadInventory: inventoryActions.loadInventory,
    addInventory: inventoryActions.addInventory
}

//when we omit mapDispatchToProps, our component gets a dispatch prop injected automatically
// the "connect" api also connects our component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
