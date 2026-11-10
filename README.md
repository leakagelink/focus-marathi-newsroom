# Focus Marathi Newsroom

# FOCUS 24 NEWS – COMPLETE MVP DEVELOPMENT
## Premium Glassmorphism UI/UX | Maharashtra Digital News Network

Act as an elite product design agency, senior SaaS architect, CTO, full-stack developer, database engineer and UI/UX specialist.

Your task is to design and develop a complete, functional MVP for FOCUS 24 NEWS, a Maharashtra-based digital Marathi news network.

I have uploaded a visual reference image showing the desired application design. You MUST carefully analyze and follow this image as the primary visual design reference.

IMPORTANT: The uploaded image is the design direction for the entire product, not just the homepage.

Build a complete interconnected application with:
1. Public News Application.
2. Journalist Mobile Application.
3. Admin & Editor Dashboard.
4. News Management and Approval System.
5. Broadcast Control Dashboard.
6. Advertisement Management.
7. AI News Voice Interface.

The final result must be a polished, working MVP that can be demonstrated to a real client.

---

# PART 1: VISUAL DESIGN – STRICT REQUIREMENTS

## 1.1 Design Philosophy

Create a premium, modern, cinematic DARK GLASSMORPHISM interface.

The design should combine:
- Premium OTT application aesthetics.
- Professional Indian television news channel branding.
- Modern enterprise SaaS dashboard design.
- Sophisticated glassmorphism.
- High-quality mobile application UI.

Follow the uploaded reference image as closely as possible.

Do not generate a generic dashboard template.

## 1.2 Color Palette

Use these design tokens consistently:

Primary Background: #08090D
Secondary Background: #111217
Glass Surface: rgba(255,255,255,0.07)
Glass Border: rgba(255,255,255,0.14)
Primary Red: #F21D36
Secondary Red: #C8102E
Neon Accent: #FF334F
Primary Text: #FFFFFF
Secondary Text: #A7A7B3
Muted Text: #737582
Success: #20C997
Warning: #F5B942

Use red neon accents sparingly for:
- Breaking News.
- Live indicators.
- Primary buttons.
- Selected navigation.
- Important statistics.

## 1.3 Glassmorphism Components

Implement reusable glass components.

Every glass card should use:
- Semi-transparent background.
- Backdrop blur.
- Thin translucent borders.
- Subtle inner highlights.
- Soft shadows.
- Carefully controlled red glow.
- Rounded corners.

Example CSS direction:

background: rgba(255,255,255,0.06);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.12);
box-shadow: 0 8px 32px rgba(0,0,0,0.35);

Use layered glass panels and subtle gradients.

Avoid excessive blur, overly bright neon, cluttered layouts and poor text contrast.

## 1.4 Branding

Brand Name: FOCUS 24 NEWS

Regional Identity: मराठी

Tagline:
MAHARASHTRA'S DIGITAL NEWS NETWORK

Create a premium original logo using typography and a simple news-inspired graphic symbol.

Display the branding consistently across:
- Splash Screen.
- Login Screen.
- Admin Dashboard.
- Journalist Portal.
- Public Homepage.
- News Player.
- Broadcast Control.

## 1.5 Typography

Use:
- Inter for English.
- Noto Sans Devanagari for Marathi and Hindi.

Ensure Marathi headlines, navigation and news content are readable.

Do not use decorative fonts that compromise readability.

## 1.6 Animations

Add subtle micro-interactions:
- Smooth button hover states with red glow.
- Floating glass cards.
- Pulse effect for LIVE indicator.
- Scrolling ticker for Breaking News.
- Elegant page transitions.

Avoid distracting animations.

---

# PART 2: TECHNOLOGY ARCHITECTURE

Build using:
- Modern frontend framework (React, Next.js or Vite).
- Tailwind CSS for styling.
- Lucide Icons.
- Reusable UI component library.
- Supabase for backend, authentication and database.
- State management for news and live controls.

The architecture must support multi-role access:
- Public Users.
- Verified Journalists.
- Editors.
- Chief Editor / Admin.

---

# PART 3: APPLICATION STRUCTURE

The application must include these primary modules:

1. Public News Portal (Desktop & Mobile Responsive).
2. Journalist Mobile Application Portal.
3. Central Admin & Editorial Dashboard.
4. Broadcast & Live Stream Control Center.
5. AI Voice News Generation Module.
6. Advertisement Management Module.
7. Journalist Performance & Earnings Module.

Add a global navigation switcher allowing demonstration of all portals from one unified environment.

---

# PART 4: JOURNALIST MOBILE APPLICATION

Design a dedicated mobile view optimized for smartphones representing the journalist experience shown in the reference image.

## 4.1 Journalist Profile Header

Display:
- Journalist Name (e.g., Rajesh Patil).
- Role: Vidhan Sabha Pratinidhi.
- Assigned Constituency Code: ASM-144 (Karad South).
- District: Satara.
- Account Status: Active (Green Badge).
- Total Submitted News Counter.
- Approved News Counter.

## 4.2 Structured News Upload Workflow

Journalists must upload news using a mandatory 4-video sequence plus a written script:

1. Location Visual (10 seconds)
   - Mandatory field.
   - Shows site footage.

2. Anchoring Clip (20 seconds)
   - Mandatory field.
   - Journalist reporting on camera.

3. First Byte (60 seconds)
   - Statement from primary person (official, victim or witness).

4. Second Byte (60 seconds)
   - Supporting statement or public reaction.

Provide:
- Upload buttons for each video with duration badges.
- Upload progress indicators.
- Success confirmation states.
- Mock video preview playback.

## 4.3 News Script Input

- Text area for 80-100 word news script in Marathi.
- Character / word counter.
- AI Voiceover Toggle: "Use AI Female Voice (Marathi)".
- District selector (36 districts of Maharashtra).
- Assembly Constituency selector (288 constituencies).
- Primary Category selector.
- News Headline input.

## 4.4 Submission Action

- Big branded submit button: "बातमी अपलोड करा".
- Loading state during submission.
- Success modal with tracking ID.

## 4.5 Journalist Dashboard Features

- My Uploads list with status filters:
  - Pending Review.
  - Approved.
  - Rejected (with editor feedback reason).
  - Broadcasted.
- Monthly Earnings Summary:
  - Fixed Monthly Retainer.
  - Per-Approved-News Incentive.
  - Payment Status (Paid / Processing).

---

# PART 5: ADMIN DASHBOARD

Design an enterprise-grade dark glassmorphism dashboard as seen in the reference image.

## 5.1 Key Metrics Cards

Display 4 primary statistic cards with glass design and red glow:

1. Vidhan Sabha Representatives: 288 (Active: 242)
2. District Representatives: 36 (Active: 36)
3. Pending News Approvals: Dynamic Counter
4. Approved Today: Dynamic Counter

Additional KPI Cards:
- Total Video Stories Produced.
- Live Viewers Count.
- Active Advertisers.
- Monthly Revenue Estimate.

## 5.2 Navigation Menu

Sidebar or top navigation with icons:
- Dashboard Overview.
- News Approvals Queue.
- Live Broadcast Studio.
- Journalist Network.
- Assembly Directory (288 seats).
- District Directory (36 districts).
- Breaking News Controller.
- Superfast 100 Manager.
- AI Voiceover Studio.
- Advertisement Manager.
- Financials & Journalist Payments.
- System Settings.

---

# PART 6: JOURNALIST MANAGEMENT

Manage the grassroots network across Maharashtra.

## 6.1 Journalist Directory

Table with:
- Journalist Photo / Avatar.
- Name.
- District.
- Assembly Constituency.
- Phone & Email.
- Performance Score (Rating 1-5).
- News Submitted / Approved.
- Verification Status badge.
- Action buttons: View Profile, Edit, Deactivate, View Submissions.

## 6.2 Journalist Registration & Verification

- Form to register new journalists.
- Assign District and Vidhan Sabha Constituency.
- Document upload preview (Press ID, Aadhaar).
- Approval workflow for new applicants.

---

# PART 7: DISTRICT & ASSEMBLY MANAGEMENT

The core differentiator of FOCUS 24 NEWS is hyperlocal Maharashtra coverage.

## 7.1 District Hierarchy

Include all 36 Districts categorized by revenue divisions:
- Konkan Division.
- Pune Division.
- Nashik Division.
- Chhatrapati Sambhajinagar Division.
- Amravati Division.
- Nagpur Division.

## 7.2 Vidhan Sabha Mapping

- 288 Constituencies mapped to their respective districts.
- Indicator showing if constituency has an assigned representative.
- Filter news by District and Assembly segment.

---

# PART 8: NEWS EDITORIAL & APPROVAL SYSTEM

The central editorial workflow where editors review raw footage and publish polished stories.

## 8.1 Approval Queue

List of incoming submissions with:
- Thumbnail.
- Marathi Headline.
- Constituency & District tags.
- Reporter Name.
- Submission Timestamp.
- Video Checklist Status (Visual, Anchor, Byte 1, Byte 2).
- Status: Urgent / Standard.

## 8.2 Review Studio

Split-screen review interface:
- Left: 4 video players showing raw footage clips.
- Right: News details and editor controls.
  - Editable Marathi Headline.
  - Editable Script.
  - Category selector (Politics, Crime, Agriculture, Weather, Sports, Entertainment).
  - Importance level (Normal, Trending, Breaking News).
  - AI Voiceover preview player.
- Action Buttons:
  - Approve & Publish.
  - Send to Broadcast Queue.
  - Reject with Reason notes.
  - Request Revision from Reporter.

---

# PART 9: BREAKING NEWS

- Real-time ticker controller.
- Input breaking news headline in Marathi.
- Select target region (Statewide or specific District).
- Duration timer for ticker display.
- One-click push notification trigger.
- Active breaking news list with delete / edit controls.

---

# PART 10: SUPERFAST 100 BULLETIN

A signature news format: 100 rapid news updates.

- Playlist manager for Superfast 100.
- Drag-and-drop ordering of approved short stories.
- Total runtime calculator (target: 15-20 minutes).
- Automated transition graphics preview.
- One-click publish bulletin to public app and YouTube export queue.

---

# PART 11: BROADCAST CONTROL CENTER

A modern TV control room interface in dark glass style.

## 11.1 Master Control Screen

- Main live stream video preview with broadcast graphics overlay.
- Audio level meters (VU meters).
- On-Air Status Indicator (Glowing Red Pulse).
- Current Program Title and Next Scheduled Program.

## 11.2 Stream Source Switcher

Buttons to switch stream input:
- Studio Anchor Feed.
- Field Live OB Van / Mobile Stream.
- Superfast 100 Automated Playlist.
- Commercial Break (Ad Playlist).
- Emergency Standby Slate.

## 11.3 Lower-Third & Graphic Overlays

Live control buttons to trigger:
- Breaking News Banner (लाल पट्टी).
- Reporter Name & Location Bug.
- Big Headline Slug.
- Emergency Phone Numbers / Helpline banner.
- Channel Logo Watermark toggle.

## 11.4 Multi-Platform Restreaming

Status toggles showing live broadcast to:
- Mobile Application Live Feed.
- YouTube Live.
- Facebook Live.
- Fast Channel / OTT Feed.

---

# PART 12: AI NEWS VOICE

Automated voice generation for rapid bulletin production.

- Text-to-Speech editor with Marathi and Hindi text support.
- Voice Selector:
  - Marathi Female Anchor (Professional News Tone).
  - Marathi Male Anchor (Deep Authoritative Tone).
  - Hindi Female Anchor.
  - Hindi Male Anchor.
- Speed and pitch controls.
- Generate Audio button with progress indicator.
- Waveform audio player preview.
- Attach generated audio to approved story.

---

# PART 13: AUTOMATIC NEWS VIDEO PREPARATION

Simulated automatic cloud video stitching:
- Combines the 4 uploaded video segments:
  1. Opening Anchor intro (with lower third).
  2. Location visuals (with voiceover background).
  3. Interview Byte 1.
  4. Interview Byte 2.
  5. Standard FOCUS 24 NEWS animated outro.
- Progress bar showing automated rendering stages.
- Final preview player before publishing.

---

# PART 14: ADVERTISEMENT MANAGEMENT

Local and statewide monetization platform.

## 14.1 Campaign Manager

- Advertiser name and contact.
- Ad Type:
  - Video Pre-roll (10s / 15s).
  - Homepage Banner.
  - News Detail In-Article Banner.
  - Ticker Sponsor Logo.
  - Live Stream Lower-Third Ad.
- Targeting:
  - Statewide (Entire Maharashtra).
  - Specific Revenue Division.
  - Specific District.
- Start Date and End Date.
- Impressions & Click Counter.
- Budget and Payment Status.

## 14.2 Ad Creative Upload

- Image and video banner preview.
- Destination URL input.
- Active / Inactive switch.

---

# PART 15: JOURNALIST PAYMENT MANAGEMENT

Transparency and motivation for rural stringers.

- Monthly earnings calculator:
  - Base Retainer (e.g. ₹5,000/month).
  - Per Approved Story Bonus (e.g. ₹200/approved news).
  - Breaking News Exclusive Bonus.
- Invoice generation preview.
- Export payment sheet to CSV.
- Mark payout as Completed.

---

# PART 16: SUPABASE DATABASE

Provide a complete PostgreSQL database schema ready for Supabase implementation.

Include tables:
1. `profiles` (User metadata and roles).
2. `districts` (36 Maharashtra districts).
3. `constituencies` (288 Vidhan Sabha seats mapped to districts).
4. `journalists` (Constituency assignments, credentials, rating).
5. `news_articles` (Headlines, Marathi script, category, location, status).
6. `news_media` (Video clip URLs, sequence type, duration).
7. `breaking_news` (Active banners, priority, region).
8. `bulletins` (Superfast 100 playlists).
9. `advertisements` (Client, creative URL, targeting, impressions).
10. `payments` (Monthly journalist payout ledger).

Include sample seed data for:
- 5 Districts with sample constituencies.
- 5 Verified Journalists.
- 10 Realistic Marathi News Stories with video placeholder thumbnails.
- 3 Active Breaking News items.
- 2 Active Advertisements.

---

# PART 17: AUTHENTICATION & SECURITY

Implement role-based access:
- Public Users: No login required for reading; optional login for bookmarks.
- Journalists: Secure login via Phone OTP / Password; access restricted to Journalist Mobile Portal.
- Editors: Login to News Review and Ticker.
- Admins: Unrestricted access to entire system and financial settings.

Include a quick "Demo Role Switcher" in the header to effortlessly test all 4 personas without logging out.

---

# PART 18: NOTIFICATIONS

- Push notification trigger for Breaking News.
- WhatsApp notification simulation for journalists when news is approved.
- Daily editorial summary alert.

---

# PART 19: DEMO ENVIRONMENT

To make the application demonstration ready immediately:
- Pre-populate all screens with authentic Marathi news content.
- Use high-quality imagery reflecting Maharashtra:
  - Mumbai Vidhan Bhavan.
  - Farmer agriculture stories.
  - Infrastructure and metro projects.
  - Local cultural and weather updates.
- Include working audio and video previews using open-source media placeholders.
- Ensure every button, filter and modal triggers a visible, realistic action.

---

# PART 20: RESPONSIVE EXPERIENCE

The application must shine on both:
1. Mobile Screen Container: Showcase the public user app and journalist upload app in an authentic smartphone frame (like the reference image).
2. Full Desktop Screen: Showcase the enterprise Admin Dashboard and Broadcast Control Center.

Add a simple viewport switcher at the top:
- Mobile App View (Public User).
- Mobile App View (Journalist).
- Desktop Admin View.
- Desktop Broadcast Studio View.

---

# PART 21: DEVELOPMENT EXECUTION

Implement cleanly structured code:
- Clear folder hierarchy:
  - `/components/ui` (Glassmorphism cards, buttons, badges, inputs).
  - `/components/public` (News feed, live TV, category navigation).
  - `/components/journalist` (Multi-clip upload, script form, earnings).
  - `/components/admin` (Metrics, approval studio, broadcast controls).
  - `/components/broadcast` (Switcher, VU meter, ticker controls).
  - `/data` (Districts, constituencies, mock news).
  - `/types` (TypeScript interfaces for news, journalist, ad).

Ensure high visual polish:
- Flawless dark glassmorphism.
- Consistent red accents (#F21D36).
- Authentic Marathi typography (Noto Sans Devanagari).
- Real-time interactive state for all controls.

---

# FINAL QUALITY EXPECTATIONS

The client will evaluate this prototype to decide whether to commission the full digital network across all 288 Vidhan Sabha segments.

Make sure:
- The design strictly adheres to the uploaded dark glassmorphism reference.
- All key modules described above are accessible and functional.
- The workflow from Journalist Upload -> Editorial Approval -> Live Broadcast -> Public App is visible and demonstrable.

Deliver an exceptional, client-ready MVP for FOCUS 24 NEWS.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://focus-marathi-newsroom.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb231091-24a5-4879-84ba-65225ac915d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
