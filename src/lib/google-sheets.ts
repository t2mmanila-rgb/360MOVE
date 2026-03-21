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
  
  let fileId = linkOrId.trim();

  if (fileId.startsWith('http')) {
    try {
      const url = new URL(fileId);
      const idParam = url.searchParams.get('id');
      if (idParam) {
        fileId = idParam;
      } else {
        const match = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
    } catch (e) {
      const match = fileId.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
  }

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
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
// USER: Replace this URL with your deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7--LX2UwK649yFZW8rvjnpxnuIoPoBp_3fN3_nblt03Tm4JWUndvvgb4wZJPnQ38w/exec';

// USER: Replace this with your actual Google Sheet ID for the Passport Challenge
export const PASSPORT_CHALLENGE_SHEET_ID = '1AlZKy1eIdkO40v8HW4EfzF2d-1ZK1kTZwCbGIDUkwPA';

/**
 * Syncs the full user profile (including advanced details and points) to Google Sheets.
 */
export const syncUserProfileToSheet = async (profile: any) => {
  const scriptUrl = GOOGLE_SCRIPT_URL;
  
  try {
    const data = {
      fullName: profile.name,
      email: profile.email,
      mobileNumber: profile.mobile,
      fitnessLevel: profile.fitnessLevel || "",
      workoutFrequency: profile.workoutFrequency || "",
      yearsActive: profile.yearsActive || "",
      preferredTime: profile.preferredTime || "",
      trainingGoal: profile.trainingGoal || "",
      dietType: profile.dietType || "",
      supplementUsage: (profile.supplementUsage || []).join(', '),
      occupation: profile.occupation || "",
      workSetup: profile.workSetup || "",
      incomeBracket: profile.incomeBracket || "",
      companyName: profile.companyName || "",
      pointsOnboarding: 1, // Base point for signing up
      pointsProfileCompletion: profile.profileCompleted ? 1 : 0,
      pointsHRShare: profile.pointsHRShare || 0,
      pointsScans: profile.pointsScans || 0,
      totalPoints: profile.points || 1,
      agreeTC: profile.agreePrivacy || false,
      agreePrivacy: profile.agreePrivacy || false,
      signupDate: profile.signupDate || new Date().toISOString()
    };

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
    console.error('Error syncing user profile:', error);
    return false;
  }
};
