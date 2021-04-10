import React, { useState, useEffect, useReducer, Reducer, useContext } from "react";
import { Select, FormControl, InputLabel, Container, Button, Input, CircularProgress, Card, CardHeader, CardMedia, CardContent, Typography, CardActions, IconButton, Grid, withStyles, makeStyles, TextField, LinearProgress, LinearProgressProps, Box } from "@material-ui/core";
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
import clsx from "clsx";
import { setGridRowCountStateUpdate } from "@material-ui/data-grid";
import { POINT_CONVERSION_UNCOMPRESSED } from "constants";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number } & { vitamin: any }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <Typography variant="body2" color="textSecondary">{`${props.vitamin.Vitamin}`}</Typography>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${props.value}%`}</Typography>
            </Box>
        </Box>
    );
}

function VitaminProgressBars({ props }) {
    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
    });

    let initialArray: number[] = [];

    for (let i = 0; i < props.vitaminNutritionFacts.length; i++) {
        initialArray.push(0);
    }
    const [progress, setProgress] = React.useState<number[]>(initialArray);
    const vitaminPercentCombo = props.vitaminNutritionFacts.flatMap(x => x.NutritionFact);
    //console.log('vitaminPercentCombo', vitaminPercentCombo);
    const lookup = vitaminPercentCombo.reduce((lookupTable, v) => {
        lookupTable[v.Vitamin] = ++lookupTable[v.Vitamin] || 0;
        return lookupTable;
    }, {});

    const vitaminPercentagesToSum = vitaminPercentCombo.filter(x => lookup[x.Vitamin] >= 1);

    const vitaminPercentArray = vitaminPercentagesToSum.reduce((aggregatedVitaminPercent, currentVitamin) => {
        aggregatedVitaminPercent[currentVitamin.Vitamin] = aggregatedVitaminPercent[currentVitamin.Vitamin] + currentVitamin.Percent || currentVitamin.Percent;
        return aggregatedVitaminPercent;
    }, {});

    let transformedVitaminPercentArr: any[] = [];
    for (const [key, value] of Object.entries(vitaminPercentArray)) {
        const obj = Object.assign({}, { Vitamin: key, Percent: value });
        transformedVitaminPercentArr.push(obj);
    }

    //Add the summed up vitamins back into the original array
    const transformedVitaminPercentArray = [...vitaminPercentCombo.filter(x => !transformedVitaminPercentArr.map(y => y.Vitamin).includes(x.Vitamin)), ...transformedVitaminPercentArr];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeout(() => clearInterval(timer), 20000);
            transformedVitaminPercentArray.map((vitamin, index) => {
                progress[index] >= 100 ?
                    progress.splice(index, 1, 100)
                    :
                    progress[index] >= vitamin.Percent
                        ? progress.splice(index, 1, vitamin.Percent)
                        : progress.splice(index, 1, progress[index] + 1);
                setProgress([...progress]);
            });
            if (compareArrays(progress, transformedVitaminPercentArray.map(x => x.Percent))) {
                clearInterval(timer);
            }
        }, 100);
    }, []);


    function compareArrays(a: number[], b: number[]): boolean {
        console.log('a+b', a, b);
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {transformedVitaminPercentArray.map((vitamin, index) => {
                return <LinearProgressWithLabel value={progress[index]} vitamin={vitamin} />
            })}
        </div>
    )
}


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
    const isVitaminLoading = props.status === actionTypes.VITAMIN_REQUEST_STATUS.LOADING;
    const isVitaminSuccess = props.status === actionTypes.VITAMIN_REQUEST_STATUS.SUCCESS;
    const isVitaminError = props.status === actionTypes.VITAMIN_REQUEST_STATUS.ERROR;

    const [inventoryChosen, setInventoryChosen] = useState([]);

    const InventoryContainer = withStyles({
        root: {
            display: 'flex',
            flexDirection: 'row'
        },
    })(Container);

    const ConsumeInventory = withStyles({
        root: {
            alignSelf: 'flex-end',
            justifyContent: 'center',
            background: 'red',
            color: 'white',
            marginLeft: 'auto'
        },
    })(Button);

    const gatherSelections = (data) => {
        setInventoryChosen(data);
    }

    function consumeInventory() {
        console.log('sending following selections to be consumed:', inventoryChosen);
        props.consumeInventory(inventoryChosen);
    }

    return (
        <Container maxWidth="lg">
            {isVitaminLoading && <CircularProgress />}
            {
                isVitaminSuccess && <VitaminProgressBars props={props}></VitaminProgressBars>
            }
            <InventoryContainer>
                <ConsumeInventory onClick={consumeInventory}>Consume</ConsumeInventory>
            </InventoryContainer>
            <InventorySearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {isLoading && <CircularProgress />}
            {
                (isSuccess || isVitaminSuccess) &&
                <InventoryComponent searchQuery={searchQuery} inventory={props.inventory} gatherSelections={gatherSelections}></InventoryComponent>
            }
            {errors && <span>{errors.name}</span>}
            {(isError || isVitaminError) && <p>Error occured! {props.error}</p>}
        </Container>
    )
}

const InventoryComponent = (props: any) => {
    const inventoryNames = props.inventory.map((i: any) => i.Name);

    const [itemsSelected, setItemsSelected] = useState<any[]>([]);

    const chooseItem = (item: any) => {
        console.log('itemsSelected', itemsSelected);
        const indexOfItem = itemsSelected.findIndex(x => x.Name === item.Name);
        if (indexOfItem > -1) {
            itemsSelected[indexOfItem].Amount = item.Amount;
            setItemsSelected([...itemsSelected]);
        } else {
            setItemsSelected([...itemsSelected, item]);
        }
    }

    const removeItem = (item: string) => {
        setItemsSelected(itemsSelected.filter(x => x !== item));
    }

    props.gatherSelections(itemsSelected);

    const itemFunctionRefs = { chooseItem, removeItem };

    return (
        <Grid container direction="row">
            {inventoryImages.filter((image: InventoryImage) => {
                return (image.name.toLowerCase().includes(props.searchQuery.toLowerCase()) && inventoryNames.includes(image.name))
            }).map((inventoryImage: InventoryImage) =>
                <Grid item xs={4}>
                    <ItemCard id={inventoryImage.name} inventoryImage={inventoryImage} itemFunctions={itemFunctionRefs}></ItemCard>
                </Grid>
            )}
        </Grid>
    )
}



const ItemCard = (props) => {

    const cardStyle = makeStyles({
        root: {
            '&:hover': {
                cursor: 'pointer'
            },
            '& .inventory-data.chosen': {
                borderStyle: 'solid',
                borderColor: 'red',
                borderRadius: 3,
                color: 'black',
            },
        }
    })(Card);

    const classes = cardStyle;

    let [count, setCount] = useState(0);
    const showChosen = ($event) => {
        if ($event.target.name === 'measurement') {
            return;
        }
        setCount(++count);
        //count % 2 === 1 ? props.itemFunctions.chooseItem({ name: $event.target.alt }) : props.itemFunctions.removeItem($event.target.alt);
    }

    const measurementInput = (amount: string, measurementObj: any) => {
        console.log('austin may', amount, measurementObj);
        props.itemFunctions.chooseItem({ Amount: amount, Name: measurementObj.name, Measurement: measurementObj.measurement });
    }

    return (
        <div className={classes.root}>
            {props.itemsSelected}
            <Card id={props.id} className={
                clsx('inventory-data', {
                    chosen: count % 2 === 1
                })} onClick={showChosen}>
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
                    <TextField type='text'
                        disabled={count % 2 === 0}
                        name='measurement'
                        label={props.inventoryImage.measurement}
                        size='small'
                        variant="outlined"
                        style={{ marginTop: '5%', width: '50%' }}
                        onChange={(e) => measurementInput(e.target.value, { name: props.id, measurement: props.inventoryImage.measurement })} />
                </CardContent>
            </Card>
        </div>
    )
}

Inventory.propTypes = {
    loadInventory: PropTypes.func.isRequired
}

// Determines what state is passed to our component via props
function mapStateToProps(state) {
    const { inventory, status, vitaminNutritionFacts } = state.inventoryStore;
    return {
        inventory: inventory,
        status,
        vitaminNutritionFacts
    }
}

// What actions we want to expose on our component
const mapDispatchToProps = {
    loadInventory: inventoryActions.loadInventory,
    consumeInventory: inventoryActions.consumeInventory
}

//when we omit mapDispatchToProps, our component gets a dispatch prop injected automatically
// the "connect" api also connects our component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
