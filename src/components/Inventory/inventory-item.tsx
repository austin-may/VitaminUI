import { InventoryImage } from "../../models/inventory-models";
import styled from 'styled-components';


export default function InventoryItem(props: { inventoryImage: InventoryImage }) {
  const ImageContainer = styled.img`
      height: 250px;
      width: 250px;
    `;
  return (
    <ImageContainer key={props.inventoryImage.name} src={props.inventoryImage.imageSrc} alt={props.inventoryImage.name} />
  )
}