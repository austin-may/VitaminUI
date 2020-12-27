import { InventoryImage } from "./InventoryRenderProps";

export default function InventoryItem(props: { inventoryImage: InventoryImage }) {
    return (
        <img src={props.inventoryImage.imageSrc} alt={props.inventoryImage.name} />
    )
}