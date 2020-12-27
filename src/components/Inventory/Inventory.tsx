import React, { useState } from "react";
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
                                return image.name.includes(searchQuery.toLowerCase())
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