import React from 'react';
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import Inventory from '../inventory/inventory';
import Components from '../inventory-data/inventory-data';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: any;
}

function TabPanel(props: TabPanelProps) {

    const { children, value, index, ...other } = props;

    return (
        <Box p={10}>
            {value === index && children}
        </Box>
    )
}


function Header() {
    const activeStyle = { color: '#F15B2A' };

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    }

    return (
        <div>
            <AppBar>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Inventory" />
                    <Tab label="Vitamin" />
                    <Tab label="Personal" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Router>
                    <Switch>
                        <Route path='/' exact>
                            <Components.ConnectedInventoryData />
                        </Route>
                        <Route path='/nutritionFacts/:inventoryName'>
                            <Components.ConnectedNutritionInfoForInventoryItem />
                        </Route>
                    </Switch>
                </Router>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Inventory />
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </div>

    )
}

export default Header;