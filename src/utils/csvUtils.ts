export interface CSVRow {
  [key: string]: string;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCampaignRevenue = (data: CSVRow[], campaign: string): number => {
  return data
    .filter(row => row.Campaign === campaign)
    .reduce((total, row) => {
      const revenue = parseFloat(row.Revenue) || 0;
      return total + revenue;
    }, 0);
};

export const getETRevenueSummary = (data: CSVRow[]): Array<{et: string, revenue: number}> => {
  const etRevenue: { [key: string]: number } = {};
  
  data.forEach(row => {
    const et = row.ET || 'Unknown';
    const revenue = parseFloat(row.Revenue) || 0;
    etRevenue[et] = (etRevenue[et] || 0) + revenue;
  });
  
  return Object.entries(etRevenue)
    .map(([et, revenue]) => ({ et, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const parseCSV = (csvText: string): CSVRow[] => {
}