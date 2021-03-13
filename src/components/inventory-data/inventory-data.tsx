import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid"
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import React, { ChangeEvent, useEffect, useReducer, useState } from "react"
import * as inventoryActions from '../../redux/actions/inventory-actions';
import { CircularProgress, Container, FormControl, FormHelperText, InputLabel, Select, Input, Fab, Dialog, Button, DialogContent, Icon, TextField, withStyles } from "@material-ui/core";
import inventory from "../inventory/inventory";
import { InventoryItem } from "../../models/inventory-models";
import * as actionTypes from '../../redux/actions/actionTypes';
import styled from 'styled-components';
import { Send } from "@material-ui/icons";
import { inventoryStore } from "../../redux/reducers/inventory-reducers";

const InventoryForm = ({ props }) => {
    const { addInventory, setOpenDialog } = props;

    const FormContainer = styled.div`
    height: 550px;
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;    
  `;

    const InventoryFormButton = withStyles({
        root: {
            background: 'red',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 48,
            padding: '0 30px',
            flex: '0 0 40px',
            width: '25%',
            alignSelf: 'flex-end'
        },
        label: {
            textTransform: 'capitalize',
        },
    })(Button);

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const Name = formData.get('name');
        const Count = formData.get('count');
        const Site = formData.get('site');
        const newInventoryItem = { Name, Count, Site };

        //if (!formIsValid()) return;
        addInventory(newInventoryItem);
        setOpenDialog(false);
    }

    return (
        <form onSubmit={handleSubmit}>

            <FormContainer>
                <TextField type='text'
                    name='name'
                    label='Name'
                    variant="outlined" />
                <TextField type='text'
                    name='price'
                    label='Price'
                    variant="outlined" />
                <TextField type='text'
                    name='expiration'
                    label='Expiration Date'
                    variant="outlined" />
                <TextField type='text'
                    name='count'
                    label='Count'
                    variant="outlined" />
                <FormControl variant='outlined'>
                    <InputLabel>Site</InputLabel>
                    <Select
                        native
                        name='site'
                        label="Site">
                        <option value='Ansley Mall'>Ansley Mall</option>
                        <option value='Brookhaven'>Brookhaven</option>
                        <option value='GA Tech Campus'>GA Tech Campus</option>
                    </Select>
                </FormControl>
                <TextField type='text'
                    name='sku'
                    label='SKU Number'
                    variant="outlined" />
                <InventoryFormButton
                    variant="contained"
                    color="primary"
                    type='submit'
                    endIcon={<Send></Send>}>
                    Send
                </InventoryFormButton>
            </FormContainer>
        </form>

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

    const InventoryDataContainer = withStyles({
        root: {
            display: 'flex',
            flexDirection: 'row'
        },
    })(Container);

    const AddInventory = withStyles({
        root: {
            alignSelf: 'flex-start',
            justifyContent: 'center',
            background: 'red',
            color: 'white'
        },
    })(Button);

    const SiteSelection = withStyles({
        root: {
            marginLeft: 'auto'
        },
    })(FormControl);


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
                    <InventoryDataContainer>
                        <AddInventory color="primary" aria-label="add" onClick={addInventoryDialog}>Add Inventory
                            <AddIcon />
                        </AddInventory>
                        <AddInventoryDialog open={openDialog} setOpenDialog={setOpenDialog} formProps={formProps}>
                        </AddInventoryDialog>
                        <SiteSelection variant="outlined">
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
                        </SiteSelection>
                    </InventoryDataContainer>
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