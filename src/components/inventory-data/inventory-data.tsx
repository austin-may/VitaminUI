import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid"
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import React, { ChangeEvent, useEffect, useReducer, useState } from "react"
import * as inventoryActions from '../../redux/actions/inventory-actions';
import { CircularProgress, Container, FormControl, FormHelperText, InputLabel, Select, Input, Fab, Modal, Dialog, Button, DialogContent, TextField } from "@material-ui/core";
import inventory from "../inventory/inventory";
import { Inventory } from "../../models/inventory-models";
import * as actionTypes from '../../redux/actions/actionTypes';
import styled from 'styled-components';
import { FormatLineSpacingOutlined } from "@material-ui/icons";

const InventoryForm = ({ props }) => {
    const { addInventory, setOpenDialog } = props;

    const FormContainer = styled.div`
    height: 550px;
    width: 550px;
  `;

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const inventoryName = formData.get('name');
        //if (!formIsValid()) return;
        addInventory(inventoryName);
        setOpenDialog(false);
    }

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <InputLabel>Name</InputLabel>
                    <Input type='text'
                        name='name'
                    />
                    <FormHelperText>Input the name of the item to add</FormHelperText>
                </FormControl>
                <br />
                {/* <FormControl>
                    <InputLabel htmlFor="my-input">Price</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">Input the price of the item to add</FormHelperText>
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel htmlFor="my-input">Expiration Date</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">Input the expiration date of the item to add</FormHelperText>
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel htmlFor="my-input">Count</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">Input how many of this item is needed</FormHelperText>
                </FormControl> */}
                <br />
                <FormControl>
                    <InputLabel htmlFor="outlined-age-native-simple">Site</InputLabel>
                    <Select
                        native
                        label="Site">
                        <option value='All'>All</option>
                        <option value='Ansley Mall'>Ansley Mall</option>
                        <option value='Brookhaven'>Brookhaven</option>
                        <option value='GA Tech Campus'>GA Tech Campus</option>
                    </Select>
                </FormControl>
                <br />
                {/* <FormControl>
                    <InputLabel htmlFor="my-input">SKU Number</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                </FormControl> */}
                <br></br>
                <Button type="submit">Add</Button>
                <br />
            </form>

        </FormContainer>
    )
}


const AddInventoryDialog = (dialogProps) => {
    const { open, formProps } = dialogProps;

    const handleClose = () => {
        formProps.setOpenDialog(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <InventoryForm props={formProps} />
            </DialogContent>
        </Dialog>
    )
}

const InventoryData = (props) => {
    const { loadInventory, addInventory, setSite } = props;
    const [nameFromAddDialog, setNameFromAddDialog] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const formProps = { addInventory, setOpenDialog };
    // const [countFromAddDialog, setCountFromAddDialog] = useState(0);
    // const [siteFromAddDialog, setSiteFromAddDialog] = useState('');



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


    const addInventoryDialog = () => {
        setOpenDialog(true);
    }

    const isLoading = props.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.status === actionTypes.REQUEST_STATUS.ERROR;

    return (
        <Container maxWidth="lg">
            {isLoading && <CircularProgress />}
            {isSuccess &&
                <div>
                    <Fab color="primary" aria-label="add" onClick={addInventoryDialog}>
                        <AddIcon />
                    </Fab>
                    <AddInventoryDialog open={openDialog} setOpenDialog={setOpenDialog} formProps={formProps}>
                    </AddInventoryDialog>
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
    addInventory: inventoryActions.addInventory,
    setSite: inventoryActions.setSite
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryData);