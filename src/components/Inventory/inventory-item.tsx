import { InventoryImage } from "../../models/inventory-models";

export default function InventoryItem(props: { inventoryImage: InventoryImage }) {
    return (
        <img key={props.inventoryImage.name} src={props.inventoryImage.imageSrc} alt={props.inventoryImage.name} />
    )
}