import SelectInput from "@material-ui/core/Select/SelectInput";
import { SSL_OP_EPHEMERAL_RSA } from "constants";
import { InventoryConsumed, InventoryItem } from "../models/inventory-models";

export async function getInventoryAsync(): Promise<any> {
    const axios = require('axios');
    return await axios({
        url: 'http://localhost:8080/query',
        method: 'post',
        data: {
            query: `
                query getInventory {
                    inventory {
                        Name,
                        Price,
                        Count,
                        Site,
                        ExpirationDate,
                        SkuNumber,
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

export async function createInventoryAsync(newInventory: InventoryItem): Promise<any> {
    const axios = require('axios');
    return await axios.post('http://localhost:8080/query', {
        query: `
                mutation AddInventory($newInventory: NewInventory!) {
                    createInventory(input: $newInventory) {
                        Id, Name, Count, Price, ExpirationDate, Site, SkuNumber
                    }
                }
            `,
        variables: {
            newInventory
        }
    }).then(result => {
        return result.data.data
    })
}

export async function consumeInventoryAsync(inventoryConsumed: InventoryConsumed[]): Promise<any> {
    const axios = require('axios');
    return await axios.post('http://localhost:8080/query', {
        query: `
                query Consume($inventoryConsumed: [InventoryConsumed!]) {
                    vitaminNutritionFacts(inventoryConsumed: $inventoryConsumed) {
                        InventoryName,
                        NutritionFact {
                            Vitamin,
                            Percent
                        }
                    }
                }
            `,
        variables: {
            inventoryConsumed
        }
    }).then(result => {
        console.log(result);
        return result.data.data
    })
}
