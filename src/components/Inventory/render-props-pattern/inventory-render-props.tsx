import { InventoryImage } from "../../../models/inventory-models";

//Render props allows us separation of concerns so we can keep the static data separate from the logic that imposes upon it
export default function InventoryRenderProps(props: any) {
    const inventoryImages: InventoryImage[] = [
        {
            imageSrc: 'images/apple.jpg',
            name: 'apple'
        },
        {
            imageSrc: 'images/carrot.jpg',
            name: 'carrots'
        },
        {
            imageSrc: 'images/kale.jpg',
            name: 'kale'
        },
    ]

    return props.children(inventoryImages);
}