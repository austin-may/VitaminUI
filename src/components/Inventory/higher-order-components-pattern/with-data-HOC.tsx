//Obsolete: This is to show the HOC abstraction pattern

import Inventory from "../inventory"

function withData(maxInventoryToShow: number) {
    return function (Component: any) {
        const inventoryImages = [
            {
                imageSrc: 'apple.jpg',
                name: 'apple'
            },
            {
                imageSrc: 'carrot.jpg',
                name: 'carrot'
            },
            {
                imageSrc: 'kale.jpg',
                name: 'kale'
            },
        ]

        return function () {
            const limitInventory = inventoryImages.slice(0, maxInventoryToShow);
            return <Component inventoryImages={limitInventory}></Component> //if you wanted to use this pattern again you would need to add the destructured {inventoryImages}: any param in the Inventory component
        }
    }
}

const EnhancedInventoryComponent = withData(2)(Inventory)

export default EnhancedInventoryComponent