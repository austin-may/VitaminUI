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
