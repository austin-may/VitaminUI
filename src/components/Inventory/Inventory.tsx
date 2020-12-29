import React, { useState, useEffect } from "react";
import { Select, FormControl, InputLabel, Container } from "@material-ui/core";
import InventoryRenderProps, { InventoryImage } from "./InventoryRenderProps";
import InventoryItem from "./InventoryItem";
import InventorySearchBar from "./InventorySearchBar";


export default function Inventory() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [inventory, setInventory] = useState([""]);
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

    useEffect(() => {
        const fetchData = async () => {
            const response = await getInventoryAsync();
            let inventoryNames: any[] = response.data.data.inventory;
            let names = inventoryNames.map((x: any) => x.Name);
            console.log(names);
            setInventory(names);
        }
        fetchData();
    }, [])

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
            <InventoryRenderProps>
                {(inventoryImages: InventoryImage[]) => {
                    return (
                        <div>
                            {inventoryImages.filter((image: InventoryImage) => {
                                return image.name.includes(searchQuery.toLowerCase()) && inventory.includes(image.name)
                            })
                                .map((inventoryImage: InventoryImage) => {
                                    return <InventoryItem inventoryImage={inventoryImage} />
                                })}
                        </div>
                    );
                }}
            </InventoryRenderProps>

        </Container>
    )
}