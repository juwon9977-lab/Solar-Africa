import type { VendorStatsCategoryCountsItem } from './vendorStatsCategoryCountsItem';
import type { VendorStatsStateCountsItem } from './vendorStatsStateCountsItem';

export interface VendorStats {
  totalVendors: number;
  verifiedVendors: number;
  statesCovered: number;
  totalReviews: number;
  categoryCounts: VendorStatsCategoryCountsItem[];
  stateCounts: VendorStatsStateCountsItem[];
}
