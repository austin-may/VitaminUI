import { InventoryImage } from "./InventoryRenderProps";

export default function InventoryItem(props: { inventoryImage: InventoryImage }) {
    return (
        <img key={props.inventoryImage.name} src={props.inventoryImage.imageSrc} alt={props.inventoryImage.name} />
    )
}