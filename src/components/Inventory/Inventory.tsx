import React, { useState, useEffect, useReducer, Reducer, useContext } from "react";
import { Select, FormControl, InputLabel, Container, Button, Input, CircularProgress, Card, CardHeader, CardMedia, CardContent, Typography, CardActions, IconButton, Grid, Paper } from "@material-ui/core";
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
import { inventoryImages } from "./inventory-utils";
import styled from 'styled-components';

function Inventory(props) {
    const { loadInventory, addInventory } = props;
    useEffect(() => {
        loadInventory();
    }, []); //This array is an array of items to watch, and it it changes it will rerender again.
    //Otherwise, with the empty array as a second argument to effect means the effect will run only once when the component mounts.
    const err: any = {};
    const [searchQuery, setSearchQuery] = useState('');
    const [inventoryToAdd, setInventoryToAdd] = useState('');
    const [errors, setErrors] = useState(err);


    //dispatch is a good generic term for managing state on multiple state objects
    // const [{ inventory, status, error }, dispatch] = useReducer(inventoryReducer, {
    //     status: actionTypes.REQUEST_STATUS.LOADING,
    //     inventory: [],
    //     error: null
    // });

    //Remember, React components automatically re-render whenver there is a change in their sttae or props.
    const isLoading = props.state.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.state.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.state.status === actionTypes.REQUEST_STATUS.ERROR;

    function handleAdd(event) {
        event.preventDefault();
        if (!formIsValid()) return;
        addInventory(inventoryToAdd);
    }

    function formIsValid(): boolean {
        const errors: any = {};

        if (!inventoryToAdd) {
            errors.name = "Name is required.";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
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
            {isLoading && <CircularProgress />}

            {
                isSuccess &&
                <InventoryComponent searchQuery={searchQuery} inventory={props.state.inventory}></InventoryComponent>
            }
            <Input type='text' placeholder='Type inventory to add' value={inventoryToAdd}
                onChange={(e) => setInventoryToAdd(e.target.value)} />
            {errors && <span>{errors.name}</span>}
            <Button onClick={handleAdd}>Add Inventory</Button>
            {isError && <p>Error occured! {props.state.error}</p>}
        </Container>
    )
}

const InventoryComponent = (props: any) => {
    const inventoryNames = props.inventory.map((i: any) => i.Name);
    return (
        <Grid container direction="row">
            {inventoryImages.filter((image: InventoryImage) => {
                return (image.name.includes(props.searchQuery) && inventoryNames.includes(image.name))
            }).map((inventoryImage: InventoryImage, i) =>
                <Grid item xs={4}>
                    <ItemCard key={i} inventoryImage={inventoryImage}></ItemCard>
                </Grid>
            )}
        </Grid>
    )
}

const ItemCard = (props) => {
    return (
        <Card>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                    </IconButton>
                }
                title={props.inventoryImage.name}
                subheader="September 14, 2016"
            />
            <InventoryItem key={props.key} inventoryImage={props.inventoryImage} />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    This impressive paella is a perfect party dish and a fun meal to cook together with your
                    guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                </IconButton>
                <IconButton aria-label="share">
                </IconButton>
            </CardActions>
        </Card>
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
