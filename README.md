# GreenWiki - Modern Plant Care Encyclopedia 🌿

A fast, responsive, and botanical plant care web encyclopedia built with **Next.js (App Router)**, **React**, and **Tailwind CSS**. Designed for home gardeners and plant enthusiasts, GreenWiki provides complete growing and care guides with exact seasonal planting calendars, watering rhythms, visual sun-meters, soil recipes, and pest troubleshooting.

---

## 🌟 Key Features

1. **Home Page**:
   - High-impact hero section with live autocomplete search.
   - Quick category exploration pills (Indoor, Outdoor, Flowers, Vegetables, Herbs, Succulents, Fruit Trees).
   - "Best to plant this month" section that automatically identifies the current month and provides interactive quick switching.
   - Featured plants grid and interactive Plant Finder Quiz teaser.

2. **Plant Library (Browse)**:
   - Filter by **Category**, **Difficulty Level**, **Light Intensity**, **Water Requirement**, **Indoor/Outdoor**, **Best Planting Month**, and **Pet-Safe only**.
   - Dynamic sorting: Alphabetical (A-Z, Z-A), Difficulty (Easiest First), and Growth Speed.
   - Live query string sync, active filter badges, and friendly empty states.

3. **Plant Detail Care Pages (`/plants/[id]`)**:
   - **Overview**: Common name, scientific binomial, botanical family, description, and high-res image gallery.
   - **Best Growing Season**: Interactive 12-month calendar bar highlighting optimal sowing/planting months and indicating the current month.
   - **Watering Guide**: Summer vs. Winter watering frequencies, soaking methods, and side-by-side diagnostic cards for overwatering vs. underwatering symptoms.
   - **Light Requirements**: Visual 4-level Sun-Meter indicator (Low, Partial, Bright Indirect, Full Sun), daily sunlight hours, and exposure notes.
   - **Soil & Potting Mix**: Soil texture, pH range gauge, drainage requirements, and a custom DIY potting mix formula.
   - **Ideal Environment**: Temperature range, humidity levels, frost and wind tolerance, and adapted climate zones (including hot arid regions like Pakistan/Sindh).
   - **Fertilizer & Maintenance**: Feeding schedule, pruning/deadheading instructions, and repotting timeline.
   - **Common Problems & Solutions**: Card-based diagnostic guide with issue, root cause, and actionable organic fix.
   - **Quick Facts**: Difficulty badge, growth speed, pet toxicity status, and lifespan.
   - **Related Plants**: Similar botanical recommendations.
   - **One-Click Actions**: "Save to My Plants" local storage toggle, Web Share API with clipboard copy toast, and **Print Care Sheet** formatted cleanly with `@media print`.

4. **Seasonal Planting Calendar (`/calendar`)**:
   - Interactive 12-month calendar selector.
   - Region selector featuring:
     - **Hot Arid & Subtropical (Pakistan / Sindh / South Asia / Desert)**: Tailored advice avoiding midday summer heat spikes above 40°C, winter/spring vegetable flushes, and monsoon tree planting.
     - **Mediterranean**: Warm dry summers and mild wet winters.
     - **Temperate / Four-Season**: Classic spring/summer cycles with freezing winter dormancy.
   - Dynamic monthly garden checklist and expected temperature ranges.

5. **Plant Finder Quiz (`/quiz`)**:
   - 5-step intuitive quiz analyzing:
     1. Plant location (Indoor room, Balcony container, Garden bed)
     2. Sunlight exposure (Full sun, Bright indirect, Low light)
     3. Care routine & watering frequency (Busy/forgetful, Weekly, Daily)
     4. Pet safety requirements (Cats & dogs non-toxic filter)
     5. Gardening goal (Edibles, Flowers, Air purification, Beginner-friendly)
   - Intelligent compatibility score calculation with personalized match reason badges.

6. **My Garden Collection (`/saved`)**:
   - Locally persisted favorites list using browser `localStorage`.
   - Print collection sheet and clear garden options.

7. **Design & Accessibility**:
   - Earthy natural palette: Forest greens (`#1d392e`, `#2e6b50`), Sprout greens, warm creams, and terra-cotta earth accents.
   - Smooth Dark Mode toggle with persistent local preference.
   - Fast loading, SEO metadata with dynamic OpenGraph tags, and keyboard navigable controls.

---

## 🛠️ Tech Stack

- **Web Framework**: Next.js 15 (App Router, Static Export `output: 'export'`)
- **Mobile Native Shell**: Capacitor 6 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`)
- **UI & Styling**: React 19, Tailwind CSS, Lucide React icons
- **Data & Media**: Local JSON database (`/data/plants.json`) with 113 bundled offline photography assets
- **Offline Architecture**: 100% self-contained on-device client runtime (search, filters, calendar, and quiz run in-memory)

---

## 📱 Running as an Android App (Capacitor)

GreenWiki is fully configured as a native Android application using **Capacitor**. All 40 botanical profiles, 113 high-resolution plant photos, seasonal calendars, search indexing, and quizzes work **100% offline** with zero external network dependencies.

- **App Name**: GreenWiki
- **Package ID**: `com.greenwiki.app`
- **Native Platform**: Android (SDK 34+)
- **Custom Branding**: Adaptive botanical launcher icons (`mipmap-*`) and branded splash screens (`drawable-*`)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Android Studio](https://developer.android.com/studio) with Android SDK (API 34) and Command Line Tools

### 1. Build the Static Web Assets
Compile the Next.js static export (`out/` directory):
```bash
npm run build
```

### 2. Sync Web Assets to Android
Sync the exported HTML/CSS/JS and local botanical assets into the native Android assets directory:
```bash
npx cap sync
```

### 3. Run or Build the App

#### Option A: Using Android Studio (Recommended for Testing & Emulators)
Open the native project directly in Android Studio:
```bash
npx cap open android
```
From Android Studio, click **Run** (Green play button) to launch the app on your connected device or Android Virtual Device (AVD).

#### Option B: Build Debug APK via Command Line
Run the Gradle wrapper directly to produce a standalone `.apk`:
```bash
# On Windows PowerShell / Command Prompt:
cd android
.\gradlew.bat assembleDebug

# On macOS / Linux:
cd android
./gradlew assembleDebug
```
The compiled debug APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Web Development Setup


1. Clone or navigate into the project directory:
   ```bash
   cd "gardening app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

5. To create an optimized production build:
   ```bash
   npm run build
   npm run start
   ```

---

## 📖 How to Add New Plants

All botanical profiles reside in `/data/plants.json`. To add a new plant, append a new JSON object following this schema:

```json
{
  "id": "unique-kebab-cased-id",
  "commonName": "Common Plant Name",
  "scientificName": "Botanical Latin Name",
  "family": "Botanical Family (e.g. Lamiaceae)",
  "category": "Indoor | Outdoor | Flowers | Vegetables | Herbs | Succulents | Fruit Trees",
  "description": "Clear, informative 1-2 sentence description.",
  "imageUrl": "https://images.unsplash.com/...",
  "difficulty": "Easy | Moderate | Challenging",
  "growthSpeed": "Slow | Moderate | Fast",
  "petSafe": true,
  "lifespan": "Annual | Perennial | Biennial",
  "season": {
    "bestMonths": [3, 4, 9, 10],
    "bloomOrHarvest": "Spring to Early Autumn",
    "notes": "Practical seasonal note for planting or pruning."
  },
  "watering": {
    "summer": "Every 2-3 days",
    "winter": "Once a week",
    "method": "Soak and dry method at root base.",
    "overwaterSigns": "Yellow limp leaves, soft base, or root rot.",
    "underwaterSigns": "Curled leaves, dry papery tips, or wilting."
  },
  "light": {
    "type": "Full Sun | Bright Indirect | Partial Shade | Low Light",
    "hoursPerDay": "6+ hours",
    "notes": "Lighting guidance and heat protection notes."
  },
  "soil": {
    "type": "Rich loamy soil / porous cactus mix",
    "phRange": "6.0 - 7.0",
    "drainage": "Well-drained",
    "mix": "50% garden loam, 30% compost, 20% sand or perlite"
  },
  "environment": {
    "tempRange": "15°C - 35°C (59°F - 95°F)",
    "humidity": "Moderate (40% - 60%)",
    "location": "Indoor / Outdoor / Patio Container",
    "climateZones": ["Hot Arid (Sindh/Punjab)", "Subtropical", "Mediterranean"],
    "frostTolerance": "None / Low / Moderate / High"
  },
  "care": {
    "fertilizer": "Monthly balanced organic feed during active season.",
    "pruning": "Trim spent flower heads or dead stems.",
    "repotting": "Every 2 years in spring."
  },
  "problems": [
    {
      "issue": "Yellowing leaves",
      "cause": "Overwatering or nitrogen deficiency",
      "fix": "Allow topsoil to dry before watering; apply diluted compost tea."
    }
  ]
}
```

> **Prompt Example for AI expansion**:
> *"Add 20 more plants for Pakistan's climate using the same schema."*
