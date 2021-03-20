import React, { useState, useEffect, useReducer, Reducer, useContext } from "react";
import { Select, FormControl, InputLabel, Container, Button, Input, CircularProgress, Card, CardHeader, CardMedia, CardContent, Typography, CardActions, IconButton, Grid } from "@material-ui/core";
import InventoryItem from "./inventory-item";
import InventorySearchBar from "./inventory-search-bar";
import { InventoryProvider, InventoryContext } from "./inventory-context";
import { InventoryImage } from "../../models/inventory-models";
import { connect } from 'react-redux';
import * as inventoryActions from '../../redux/actions/inventory-actions';
import * as actionTypes from '../../redux/actions/actionTypes';
import { inventoryStore } from "../../redux/reducers/inventory-reducers";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'
import { inventoryImages } from "./inventory-utils";
import styled from 'styled-components';
import { createSelector } from "reselect";



function Inventory(props) {
    const { loadInventory, addInventory } = props;
    useEffect(() => {
        loadInventory();
    }, []); //This array is an array of items to watch, and it it changes it will rerender again.
    //Otherwise, with the empty array as a second argument to effect means the effect will run only once when the component mounts.
    const err: any = {};
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState(err);

    //Remember, React components automatically re-render whenver there is a change in their sttae or props.
    const isLoading = props.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.status === actionTypes.REQUEST_STATUS.ERROR;

    return (
        <Container maxWidth="lg">
            <InventorySearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {isLoading && <CircularProgress />}

            {
                isSuccess &&
                <InventoryComponent searchQuery={searchQuery} inventory={props.inventory}></InventoryComponent>
            }
            {errors && <span>{errors.name}</span>}
            {isError && <p>Error occured! {props.error}</p>}
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
    const { inventory, status } = state.inventoryStore;
    return {
        inventory: inventory,
        status
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
