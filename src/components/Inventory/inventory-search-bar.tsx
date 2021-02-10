import { Input } from "@material-ui/core";

export default function InventorySearchBar({ searchQuery, setSearchQuery }: any) {
    return (
        <Input type='text' placeholder='Search by item name' value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
    )
}