export interface InventoryImage {
    imageSrc: string,
    name: string,
    measurement?: string
}

export interface InventoryItem {
    Name: string,
    Count: number,
    Price: number,
    ExpirationDate: string,
    Site: string,
    SkuNumber: string
}

export interface InventoryConsumed {
    Name: string,
    Amount: string,
    Measurement: string
}

export interface SuppliedVitaminData {
    InventoryId: number,
    VitaminContent: VitaminContent
}

interface VitaminContent {
    VitaminId: number,
    PercentDailyValue: number
}