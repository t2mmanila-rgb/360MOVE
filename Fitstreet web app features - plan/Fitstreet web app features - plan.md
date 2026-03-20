# Fitstreet web app features - plan  
  
## 1. Google Drive & Folder Architecture  
To enable the **Auto-Sync Asset Logic**, your Google Drive at t2mmanila@gmail.com must follow this strict structure. Antigravity will "crawl" these folders to populate the web app.  
## Folder Structure  
* **[Root] 360MOVE_FITSTREET_2026**  
    * **01_Brand_Logos** (Contains all partner logos)  
    * **02_Activity_Images** (Thumbnail images for the schedule)  
    * **03_Admin_Data** (Contains the Master Google Sheet)  
## Naming Convention Guide  
The system uses **String Matching**. The name of the file must match the "Brand Name" or "Activity Name" in your spreadsheet exactly.  
* **Rule:** Name_of_Brand.ext (Use underscores for spaces if needed, or consistent casing).  
* **Example:** If the spreadsheet says Viking Fitness, the logo must be Viking_Fitness.png.  
* **Supported Formats:** .png (preferred for transparency) or .jpg.  
  
## 2. Master Spreadsheet Architecture  
This Google Sheet is the "Brain" of the app. Any change here reflects on the web app within seconds.  
## Tab 1: Passport_Brands (The Challenge)  

| Brand Name | Category | Description | Booth # | QR Secret Key | Geofence Radius |
| ---------- | -------- | --------------------- | ------- | ------------- | --------------- |
| Nike | Movement | Experience the new... | B12 | NK-2026-XP | 20m |
| G'Ballers | Sports | 3x3 League... | Court 1 | GB-2026-33 | 50m |
  
****Tab 2: Fitstreet_Program (The Schedule)****  

| Activity Name | Brand Partner | Category | Date | Time | Points | Signup Req? |
| ------------- | -------------- | ----------- | ------ | ----- | ------ | ----------- |
| Viking Games | Viking Fitness | Competitive | May 9 | 10:00 | 10 | YES |
| Animal Flow | 360MOVE | Casual | May 10 | 09:00 | 1 | NO |
  
## 3. The 360MOVE User Experience (UX) Plan  
## Phase 1: Rapid Onboarding  
* **Registration:** Fast-track signup at /events/fitstreet-2026 requesting **Name, Email, Mobile**.  
* **Personalization Pop-up:** A multi-select card UI appearing immediately after login.  
    * **Categories:** *High-Octane, Competitive, Casual/Social, Strength, Mindfulness, Recovery, Nutrition, Movement/Sports, Skill-Based, Beauty & Glow, Community, Discovery.*  
    * **Demographics:** Age Interval, City, Gender.  
* **Future Tease:** Global menu shows *Move, Mind, Live* as "Coming Soon."  
## Phase 2: The Passport Challenge & Points  
The "My Pass" page is the primary mobile view.  
* **The Grid:** All brands from the Passport_Brands tab appear. The app pulls the logo automatically from the 01_Brand_Logos folder.  
* **Activity Logic:**  
    * **Normal:** 1 point for scanning at a booth.  
    * **Bonus (Viking Games/G'Ballers):** 10 points for participating.  
    * **The "Grey-out" Effect:** Once a QR is successfully scanned, the logo turns monochrome/greyed out with a checkmark.  
    * **Signup Prompt:** If an activity (like Viking Games) requires signup, the card stays "locked" with a colored button: **"Sign Up to Earn Points."**  
## Phase 3: Location-Based Validation (Geofencing)  
To ensure users are physically present at the event in the Philippines:  
1. **Permission:** App requests GPS access when the "Scan" button is pressed.  
2. **Radius Check:** The app compares user coordinates to the **Venue Center Point** (e.g., Bonifacio High Street).  
3. **The Barrier:** If the user is outside the Geofence Radius defined in the spreadsheet, the scan is rejected with a message: *"You're too far! Get closer to the booth to claim your points."*  
4. **Security:** This prevents users from "cheating" by scanning leaked photos of the QR codes from home.  
  
## 4. Admin Dashboard & Analytics  
Accessible via /admin-t2m, this view provides real-time event intelligence:  
* **User Analytics:** Total signups, breakdown by Age/City/Gender.  
* **Engagement Heatmap:** Which categories (e.g., Beauty & Glow vs. Strength) are most selected.  
* **Booth Traffic:** Live ranking of which brands have the most "Completed" passport stamps.  
* **Sync Status:** A "Force Refresh" button to pull the latest data from the Google Sheet and images from Drive.  
  
## 5. Mobile Interface Summary  
* **Header:** User Name + Live Point Balance.  
* **Main Section:** Interactive Passport Grid (Logo images auto-loaded).  
* **Footer Sticky Bar:** [Home] [Schedule] [Scan QR] [Rewards] [Profile].  
## Next Step for the Build  
**Would you like me to draft the specific "Welcome Email" template that gets sent to users immediately after they register, including their unique digital "Pass ID"?**  
  
