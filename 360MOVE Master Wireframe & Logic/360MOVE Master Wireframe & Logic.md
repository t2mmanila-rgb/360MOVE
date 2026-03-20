# 360MOVE: Master Wireframe & Logic  
## 1. Global Navigation & Layout  
**Desktop Header:** [360MOVE LOGO] | Home | About | Programs | Events | Partners | Rewards | Discover || [Search] [Location] [Register/My Pass]  
**Mobile Sticky Bar:**  
* *Logged Out:* Home | Programs | Events | Register | Login  
* *Logged In:* Home | Programs | My Pass | Rewards | Profile  
  
## 2. The "Fork in the Road" Home Page  
The Home page acts as the traffic controller.  

| Section | Component | Purpose |
| -------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| Hero | Full-Width Banner | B2C Focus: "Your 360° Lifestyle." CTAs: [Explore Programs] [View Events] |
| Pillars | 3-Column Icon Grid | Move / Mind / Live filters. |
| Flagship | High-Impact Card | Fitstreet Heatwave. [View Event] [View Activities]. |
| The Fork | 2-Tile Split Module | Left: Corporate Wellness (B2B) → /programs/corporate

Right: Popular Programs (B2C) → /programs |
| Carousel | Universal Cards | Live feed of Reiki, Animal Flow, and EMS sessions. |
  
## 3. Page Architecture: Programs & Corporate  
This is the "Engine" of your site. It uses a Tabbed Interface to switch between Individual and B2B views.  
**C1: Corporate Wellness Landing (/programs/corporate)**  
* **Hero Section:** * Headline: "Where Wellness Meets Work"  
    * Sub-head: Professional ROI-focused copy.  
    * **Primary CTA:** [Request a Proposal] (Triggers Modal/Form)  
    * **Secondary CTA:** [Book a Consultation] (Calendly/Scheduler link)  
* **The "Why" Section:** 4-Icon grid using your deck's "Full Circle Approach."  
* **The Menu:** List of services (Workshops, Executive Retreats, On-site Fitness).  
* **The Social Proof:** ROI metrics (Productivity, Retention).  
**C2: Individual Programs Hub (/programs)**  
* **Filter Bar:** [Physical] [Mindfulness] [Nutrition] [Dance] [Corporate Wellness]  
* **Search/Sort:** "Most points," "Beginner-friendly."  
* **Program Grid:** Reusable "Universal Cards" for Reiki, Pilates, POUND, etc.  
    * *Card Logic:* Image | Category Tag | Points Value | [Book Now]  
  
## 4. Event Hub: Fitstreet & Beyond (/events)  
* **Tab 1: Flagship Events:** Feature banner for **Fitstreet 2026**.  
    * Deep links to the 11 activity landing pages (e.g., /fitstreet/animal-flow).  
* **Tab 2: Pocket Events:** Smaller partner-led workshops.  
* **Tab 3: Challenges:** Digital or hybrid fitness challenges.  
  
## 5. My Pass: The PWA Core (/my-pass)  
This page is optimized for mobile-first usage.  
* **Header:** User's Name + Points Balance.  
* **Module 1: The QR Code.** Central "Check-in" pass for all events/partners.  
* **Module 2: My Schedule.** Chronological list of booked Programs (B2C) or Corporate Consultations (B2B).  
* **Module 3: Rewards Wallet.** Available discounts and "Partner Offers."  
  
## 6. Corporate Conversion Flow (Logic)  
1. **Entry:** User clicks "Request a Proposal" from Home or /programs/corporate.  
2. **Input:** Minimalist Form: Name | Company | Headcount | Goals (Drop-down) | Budget Range.  
3. **Automated Action:** * User receives a "Corporate Inquiry" badge in their Profile.  
    * A "Corporate Offer Wallet" is initialized.  
    * Redirect to "Thank You" with a link to book a discovery call.  
  
## 7. URL Strategy for Antigravity  
* **Main:** 360move.live/  
* **B2B:** 360move.live/programs/corporate-wellness  
* **B2C Detail:** 360move.live/programs/reiki  
* **Event Landing:** 360move.live/events/fitstreet-2026  
* **Social Squeeze:** 360move.live/fitstreet/[activity-name]  
  
## Next Steps for Antigravity Build  
* **Step 1:** Create the **Universal Card Component** (used for programs, events, and partners).  
* **Step 2:** Build the **Filter Logic** for the /programs page to toggle between Individual and Corporate.  
* **Step 3:** Design the **My Pass** mobile layout, as this is where your retention happens.  
