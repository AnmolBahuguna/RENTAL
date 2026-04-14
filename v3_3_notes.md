### Release v3.3 Highlights

🚀 **Personalized Recommendations (Quiz-Based)**
• Integrated a new **"Recommended for You"** section that suggests properties based on user onboarding quiz data (City, Type, Budget).
• Custom **Horizontal Slider** with a "Peek" effect (2.5 cards visible on mobile) to encourage exploration.
• **Redesigned Match Badge**: Features a pulsing Persian Red gradient and sparkle icon, creatively positioned to avoid congestion with the Save icon.
• **Condensed Card UI**: Optimized text sizes and spacing for recommended properties to maintain a clean, compact aesthetic.

🏠 **Landlord Dashboard Refinements**
• Added **"Back to Home"** navigation for better flow.
• Standardized list layout and eliminated visual clutter for a minimalist, premium look.
• Reduced status tag sizes to `text-[7px]` for a more refined appearance.

📅 **Site Visit Booking & iOS Compatibility**
• Refactored booking section to be **fully responsive**, resolving mobile overflow and button clipping.
• Implemented a **custom date placeholder (`dd / mm / yyyy`)** and Calendar icon for iOS Safari, ensuring visibility and usability where native inputs often fail.
• Resolved raw code display by adding missing localization keys in `i18n.js`.

🛠️ **Stability & Fixes**
• Fixed `ReferenceError: Calendar is not defined` by correctly importing icons from `lucide-react`.
• Synchronized all UI and functional improvements across `ui-enhancement` and `main` branches.
