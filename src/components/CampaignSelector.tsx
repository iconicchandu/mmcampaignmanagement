import React from 'react';
import { formatCurrency } from '../utils/csvUtils';

interface CampaignSelectorProps {
  campaigns: string[];
  selectedCampaign: string;
  onCampaignChange: (campaign: string) => void;
  data: any[];
  getCampaignRevenue: (data: any[], campaign: string) => number;
  campaignETRevenue: Array<{et: string, revenue: number}>;
}

export default function CampaignSelector({ 
  campaigns, 
  selectedCampaign, 
  onCampaignChange,
  data,
  getCampaignRevenue,
  campaignETRevenue
}: CampaignSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
        <div className="flex-1 mr-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Campaign</h2>
          <select
            value={selectedCampaign}
            onChange={(e) => onCampaignChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </select>
        </div>
        
        {selectedCampaign && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-w-[200px]">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Campaign Revenue</h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(getCampaignRevenue(data, selectedCampaign))}
            </p>
          </div>
        )}
      </div>

      {selectedCampaign && campaignETRevenue.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ET Revenue Breakdown - {selectedCampaign}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaignETRevenue.map(({ et, revenue }) => (
              <div key={et} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">ET: {et}</h3>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}