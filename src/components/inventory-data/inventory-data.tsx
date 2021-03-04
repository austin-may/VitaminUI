import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid"
import { connect } from 'react-redux';
import React, { ChangeEvent, useEffect, useState } from "react"
import * as inventoryActions from '../../redux/actions/inventory-actions';
import { CircularProgress, Container, FormControl, InputLabel, Select } from "@material-ui/core";
import inventory from "../inventory/inventory";
import { Inventory } from "../../models/inventory-models";
import * as actionTypes from '../../redux/actions/actionTypes';



const InventoryData = (props) => {
    const { loadInventory, setSite } = props;

    useEffect(() => {
        loadInventory();
    }, []);

    let rows: GridRowsProp = [];
    const columns: GridColDef[] = [
        { field: 'Name', headerName: 'Name', width: 150 },
        { field: 'Count', headerName: 'Count', width: 150 },
    ];

    if (props.inventoryData && props.inventoryData.length > 0 && props.site !== undefined) {
        rows = props.site === 'All' ? props.inventoryData.map((x, index) => {
            return { id: ++index, Name: x.Name, Count: x.Count };
        })
            :
            props.inventoryData.filter(i => i.Site === props.site).map((x, index) => {
                return { id: ++index, Name: x.Name, Count: x.Count };
            });

    }

    const isLoading = props.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.status === actionTypes.REQUEST_STATUS.ERROR;

    return (
        <Container maxWidth="lg">
            {isLoading && <CircularProgress />}
            {isSuccess &&
                <div>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-age-native-simple">Site</InputLabel>
                        <Select
                            native
                            label="Site"
                            onChange={(e: ChangeEvent<{ value: any }>) => setSite(e.target.value)}
                        >
                            <option value='All'>All</option>
                            <option value='Ansley Mall'>Ansley Mall</option>
                            <option value='Brookhaven'>Brookhaven</option>
                            <option value='GA Tech Campus'>GA Tech Campus</option>
                        </Select>
                    </FormControl>
                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns}></DataGrid>
                    </div>
                </div>
            }
        </Container>
    )
}

function mapStateToProps(state) {
    const { inventory, status, site } = state.inventoryStore;
    return {
        inventoryData: inventory,
        site,
        status
    }
}

const mapDispatchToProps = {
    loadInventory: inventoryActions.loadInventory,
    setSite: inventoryActions.setSite
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryData);