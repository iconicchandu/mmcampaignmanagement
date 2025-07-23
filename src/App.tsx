import React, { useState, useMemo } from 'react';
import { Upload, Search, FileText, TrendingUp } from 'lucide-react';
import { parseCSV, CSVRow, getETRevenueSummary, formatCurrency, getCampaignRevenue } from './utils/csvUtils';
import CampaignSelector from './components/CampaignSelector';

export default function App() {
  const [data, setData] = useState<CSVRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const parsedData = parseCSV(csv);
        setData(parsedData);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
        alert('Error reading file. Please try again.');
      };
      reader.readAsText(file);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const campaignCreatives = useMemo(() => {
    const filtered = selectedCampaign
      ? searchResults.filter(row => row.Campaign === selectedCampaign)
      : searchResults;
    return filtered;
  }, [searchResults, selectedCampaign]);

  const campaignETRevenue = useMemo(() => {
    if (!selectedCampaign) return [];
    
    const campaignData = data.filter(row => row.Campaign === selectedCampaign);
    const etRevenue: { [key: string]: number } = {};
    
    campaignData.forEach(row => {
      const et = row.ET || 'Unknown';
      const revenue = parseFloat(row.Revenue) || 0;
      etRevenue[et] = (etRevenue[et] || 0) + revenue;
    });
    
    return Object.entries(etRevenue)
      .map(([et, revenue]) => ({ et, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [data, selectedCampaign]);

  const etRevenueSummary = useMemo(() => {
    return getETRevenueSummary(data);
  }, [data]);

  const campaigns = useMemo(() => {
    const uniqueCampaigns = [...new Set(data.map(row => row.Campaign))];
    return uniqueCampaigns.filter(Boolean);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            MM Campaign Management
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your CSV file to analyze campaign performance and ET revenue breakdown
          </p>
        </div>

        {!data.length ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload CSV File</h2>
            <p className="text-gray-600 mb-6">
              Select a CSV file to get started with campaign analysis
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <CampaignSelector
              campaigns={campaigns}
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
              data={data}
              getCampaignRevenue={getCampaignRevenue}
              campaignETRevenue={campaignETRevenue}
            />

            {/* ET Revenue Summary Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" />
                ET Revenue Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {etRevenueSummary.map(({ et, revenue }) => (
                  <div key={et} className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">ET: {et}</h3>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(revenue)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Search className="mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns, creatives, or any data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2" />
                  Campaign Data ({campaignCreatives.length} results)
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ET
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creative
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaignCreatives.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.Campaign}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.ET || row.SUBID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.Creative}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.Revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}