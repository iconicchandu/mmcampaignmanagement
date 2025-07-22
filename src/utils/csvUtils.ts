@@ .. @@
   return results;
 };
 
+export const getCampaignTotalRevenue = (campaign: string, data: CSVData[]): number => {
+  return data
+    .filter(row => row.campaign === campaign)
+    .reduce((total, row) => total + row.revenue, 0);
+};
+
 export const searchCreatives = (searchTerm: string, data: CSVData[]): CreativeStats[] => {