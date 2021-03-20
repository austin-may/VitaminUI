export interface InventoryImage {
    imageSrc: string,
    name: string
}

export interface InventoryItem {
    Name: string,
    Count: number,
    Price: number,
    ExpirationDate: string,
    Site: string,
    SkuNumber: string
}