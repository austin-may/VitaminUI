import React, { useState, useEffect, useReducer, Reducer } from "react";
import { Select, FormControl, InputLabel, Container } from "@material-ui/core";
import InventoryRenderProps from "./inventory-render-props";
import InventoryItem from "../inventory-item";
import InventorySearchBar from "../inventory-search-bar";
import { GET_ALL_SUCCESS, UPDATE_STATUS } from "../../../actions/inventory-actions";
import { inventoryStore } from "../../../redux/reducers/inventory-reducers";
import { InventoryImage } from "../../../models/inventory-models";
import * as actionTypes from '../../../redux/actions/actionTypes'

//Obsolete: This is to show the Render Props abstraction pattern

export default function Inventory() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    }

    const axios = require('axios');

    async function getInventoryAsync(): Promise<any> {
        return await axios({
            url: 'http://localhost:8080/query',
            method: 'post',
            data: {
                query: `
                query getInventory {
                    inventory {
                        Name,
                        Count,
                        InventoryVitamin {
                            VitaminId,
                            PercentDailyValue
                        }
                    }
                }
            `
            }
        })
    }

    const [searchQuery, setSearchQuery] = useState("");
    // dispatch is a good generic term for managing state on multiple state objects
    const [{ inventoryData, status, error }, dispatch] = useReducer(inventoryStore, {
        status: actionTypes.REQUEST_STATUS.LOADING,
        inventory: [],
        error: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getInventoryAsync();
                let inventoryNames: any[] = response.data.data.inventory;
                let names = inventoryNames.map((x: any) => x.Name);
                dispatch({
                    inventory: names,
                    type: GET_ALL_SUCCESS
                });
            } catch (ex) {
                dispatch({
                    status: actionTypes.REQUEST_STATUS.ERROR,
                    type: UPDATE_STATUS,
                    error: ex
                });
            }
        }
        fetchData();
    }, [])

    const isLoading = status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = status === actionTypes.REQUEST_STATUS.ERROR;

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
                isSuccess &&
                <InventoryRenderProps>
                    {(inventoryImages: InventoryImage[]) => {
                        return (
                            <div>
                                {inventoryImages.filter((image: InventoryImage) => {
                                    return image.name.includes(searchQuery.toLowerCase()) && inventoryData.includes(image.name)
                                })
                                    .map((inventoryImage: InventoryImage, i) => {
                                        return <InventoryItem key={i} inventoryImage={inventoryImage} />
                                    })}
                            </div>
                        );
                    }}
                </InventoryRenderProps>
            }
            {isError && <p>Error occured! {error}</p>}

        </Container>
    )
}