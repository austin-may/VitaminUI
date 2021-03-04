import SelectInput from "@material-ui/core/Select/SelectInput";
import { SSL_OP_EPHEMERAL_RSA } from "constants";

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
                        Count,
                        Site,
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

export async function createInventoryAsync(name: string): Promise<any> {
    const axios = require('axios');
    return await axios.post('http://localhost:8080/query', {
        query: `
                mutation AddInventory($newInventory: NewInventory!) {
                    createInventory(input: $newInventory) {
                        Id, Name, Count, Site
                    }
                }
            `,
        variables: {
            'newInventory': {
                'Name': name,
                'Count': 100,
                'Site': 'Ansley Mall'
            }
        }
    }).then(result => {
        return result.data.data
    })
}
