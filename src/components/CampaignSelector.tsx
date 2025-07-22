@@ .. @@
           <option value="">Select a campaign</option>
           {campaigns.map((campaign) => (
             <option key={campaign} value={campaign}>
               {campaign}
             </option>
           ))}
         </select>
+        
+        {selectedCampaign && (
+          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
+            <h3 className="text-lg font-semibold text-blue-900 mb-2">
+              Campaign Overview: {selectedCampaign}
+            </h3>
+            <div className="text-2xl font-bold text-blue-700">
+              Total Revenue: ${getCampaignTotalRevenue(selectedCampaign, data).toLocaleString()}
+            </div>
+          </div>
+        )}
       </div>
     </div>
   );
 }