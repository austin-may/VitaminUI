import { DataGrid, GridRowsProp, GridColDef, GridCellClassParams } from "@material-ui/data-grid"
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import React, { ChangeEvent, useEffect, useReducer, useState } from "react"
import * as inventoryActions from '../../redux/actions/inventory-actions';
import { CircularProgress, Container, FormControl, FormHelperText, InputLabel, Select, Dialog, Button, DialogContent, TextField, withStyles, makeStyles } from "@material-ui/core";
import inventory from "../inventory/inventory";
import { InventoryItem } from "../../models/inventory-models";
import * as actionTypes from '../../redux/actions/actionTypes';
import styled from 'styled-components';
import { Send } from "@material-ui/icons";
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from "clsx";

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

    let Name: string | null = '';
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        console.log('formData', formData);
        const Count = formData.get('count');
        const Price = formData.get('price');
        const ExpirationDate = formData.get('expirationDate');
        const Site = formData.get('site');
        const SkuNumber = formData.get('skuNumber');
        const newInventoryItem = { Id: 0, Name, Count, Price, ExpirationDate, Site, SkuNumber };

        //if (!formIsValid()) return;
        addInventory(newInventoryItem);
        setOpenDialog(false);
    }

    // This will have to do for now
    const inventoryArray = [
        'Oatmeal',
        'Egg',
        'Kale',
        'Lemon',
        'Orange',
        'Ribeye',
        'Carrot',
        'Russet potato',
        'Sweet potato',
        'Beet',
        'Apple',
        'Bell pepper (red)',
        'Chicken',
        'Ground turkey',
        'Kiwi',
        'Banana',
        'Broccolli',
        'Red Wine',
        'Salmon',
        'Coffee',
        'Water',
        'Penne pasta',
        'Colby jack cheese',
        'Burger patty'
    ];

    return (
        <form onSubmit={handleSubmit}>

            <FormContainer>
                <Autocomplete
                    id="combo-box-demo"
                    options={inventoryArray}
                    getOptionLabel={(name) => name}
                    style={{ width: '100%' }}
                    onChange={(_, value) => Name = value}
                    renderInput={(params) => <TextField {...params} label="Name" variant="outlined" />}
                />
                <TextField type='text'
                    name='count'
                    label='Count'
                    variant="outlined" />
                <TextField type='text'
                    name='price'
                    label='Price'
                    variant="outlined" />
                <TextField type='text'
                    name='expirationDate'
                    label='Expiration Date'
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
                    name='skuNumber'
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

    const useStyles = makeStyles({
        root: {
            '& .inventory-data.expired': {
                color: 'red',
                fontWeight: '600',
            }
        },
    });

    let rows: GridRowsProp = [];
    const columns: GridColDef[] = [
        { field: 'Name', headerName: 'Name', width: 150 },
        { field: 'Count', headerName: 'Count', width: 150 },
        { field: 'Price', headerName: 'Price', width: 150 },
        {
            field: 'ExpirationDate', headerName: 'Expiration Date', width: 250,
            cellClassName: (params: GridCellClassParams) =>
                clsx('inventory-data', {
                    expired: params.value != undefined && (new Date(params.value.toString()) as Date) < new Date()
                }),
        },
        { field: 'SkuNumber', headerName: 'SKU Number', width: 150 },

    ];

    if (props.inventoryData && props.inventoryData.length > 0 && props.site !== undefined) {
        rows = props.site === 'All' ? props.inventoryData.map((x, index) => {
            return { id: ++index, Name: x.Name, Count: x.Count, Price: x.Price, ExpirationDate: x.ExpirationDate, SkuNumber: x.SkuNumber };
        })
            :
            props.inventoryData.filter(i => i.Site === props.site).map((x, index) => {
                return { id: ++index, Name: x.Name, Count: x.Count, Price: x.Price, ExpirationDate: x.ExpirationDate, SkuNumber: x.SkuNumber };
            });
    }


    const addInventoryDialog = () => {
        setOpenDialog(true);
    }

    const isLoading = props.status === actionTypes.REQUEST_STATUS.LOADING;
    const isSuccess = props.status === actionTypes.REQUEST_STATUS.SUCCESS;
    const isError = props.status === actionTypes.REQUEST_STATUS.ERROR;

    const classes = useStyles();

    return (
        <Container maxWidth="md">
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
                    <div style={{ display: 'flex', height: 500 }} className={classes.root}>
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