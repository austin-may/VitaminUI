import { createSelector } from 'reselect'
import inventory from '../../components/inventory/inventory'

const getSiteFilter = state => state.inventory;

export const selectInventoryBySite = createSelector(
    [getSiteFilter], (siteFilter) => {
        switch (siteFilter) {
            case 'ALL':
                return inventory;
            default:
                return inventory.filter(x => x.Site === siteFilter)
        }
    }
)