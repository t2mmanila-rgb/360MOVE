// No imports needed for this utility

/**
 * Utility to fetch and parse data from a Google Sheet (exported as CSV).
 * Requires the Sheet to be "Published to the web" as a CSV.
 */

export const fetchGoogleSheetData = async (sheetId: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    const csvData = await response.text();
    return parseCSV(csvData);
  } catch (error) {
    console.error('Google Sheets Sync Error:', error);
    return null;
  }
};

const parseCSV = (csv: string) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/"/g, ''));
    const entry: any = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
};

/**
 * Syncs the local mock data with the fetched remote data.
 * This is a partial implementation that demonstrate how to "connect" the drive.
 */
/**
 * Resolves a Google Drive "share" link or ID into a direct image URL.
 */
export const resolveDriveImageUrl = (linkOrId: string) => {
  if (!linkOrId) return '';
  if (linkOrId.startsWith('http')) {
    const match = linkOrId.match(/\/d\/([^/]+)/);
    const fileId = match ? match[1] : linkOrId;
    return `https://drive.google.com/uc?id=${fileId}`;
  }
  return `https://drive.google.com/uc?id=${linkOrId}`;
};

/**
 * Logs a registration or booth visit to a Google Sheet via a web app endpoint.
 * Requires a Google Apps Script deployed as a Web App.
 */
export const logRegistrationToSheet = async (scriptUrl: string, data: {
  userId: string;
  userName: string;
  activityId: string;
  activityTitle: string;
  type: 'activity' | 'brand';
  timestamp: string;
}) => {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return !!response;
  } catch (error) {
    console.error('Error logging to sheet:', error);
    return false;
  }
};
