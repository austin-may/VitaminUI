import React from 'react';
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import Inventory from '../Inventory/inventory';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: any;
}

function TabPanel(props: TabPanelProps) {

    const { children, value, index, ...other } = props;

    console.log(props);

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
                <Inventory />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </div>

    )
}

export default Header;