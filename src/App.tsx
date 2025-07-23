@@ .. @@
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCampaign, setSelectedCampaign] = useState<string>('');
+  const [isLoading, setIsLoading] = useState(false);
 
   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
@@ .. @@
     if (file) {
+      setIsLoading(true);
       const reader = new FileReader();
       reader.onload = (e) => {
         const csv = e.target?.result as string;
         const parsedData = parseCSV(csv);
         setData(parsedData);
+        setIsLoading(false);
       };
+      reader.onerror = () => {
+        setIsLoading(false);
+        alert('Error reading file. Please try again.');
+      };
       reader.readAsText(file);
     }
   };
@@ .. @@
   return (
     <div className="min-h-screen bg-gray-50">
       <div className="container mx-auto px-4 py-8">
+        {isLoading && (
+          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
+            <div className="bg-white p-6 rounded-lg shadow-lg">
+              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
+              <p className="text-gray-600">Loading data...</p>
+            </div>
+          </div>
+        )}
+        
         <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-gray-800 mb-4">
             MM Campaign Management
@@ .. @@