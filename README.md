# 🌱 FarmConnect – Local Farmer Market Information System

> **A modern, responsive digital marketplace connecting local Indian agriculturalists directly with consumers and bulk buyers — eliminating middlemen commissions and ensuring fair Mandi benchmark pricing.**

---

## 📌 Problem Statement
In traditional agricultural supply chains, farmers often receive only **30–50% of the final retail price** due to multiple layers of intermediaries, commission brokers (arhtiyas), and lack of direct market access. Meanwhile, consumers pay inflated prices for produce that has spent days in transit.

**FarmConnect** bridges this gap:
- **Farmers** publish crop harvest availability, quantity, pricing, and authentic contact details.
- **Consumers & Retailers** discover local harvests, compare prices across different farmers selling the same crop against official APMC Mandi rates, and contact farmers directly via one-click **Call** or **WhatsApp**.
- **Middlemen Fee: ₹0 (Zero Commission).**

---

## 🚀 Key Features

### 1. 🌾 Dual Engine Architecture (Cloud Firebase + Seamless Demo Mode)
- **Live Firebase Support**: Integrated with Firebase Authentication, Cloud Firestore, and Firebase Storage.
- **Instant Demo Mode**: If Firebase keys are not provided in `.env`, the application automatically activates **Demo Mode with LocalStorage persistence**. Evaluators can test full CRUD operations, registration, inquiries, and filtering without setting up a Firebase project!
- **1-Click Role Switcher**: Quick simulator for **Demo Farmer** (*Gurpreet Singh Dhillon*), **Consumer** (*Rajesh Sharma*), and **Platform Admin**.

### 2. 🚜 Farmer Dashboard & Crop Management
- **Dashboard Metrics**: Active listings count, in-stock quantity, inquiry volume, and estimated inventory valuation (₹).
- **Listing CRUD**: Add new harvest, edit prices/quantities, toggle between `In Stock` and `Sold Out`, or remove listings.
- **Direct Inquiries Inbox**: View consumer purchase requests with caller details, quantities, and direct response actions.

### 3. 📸 Farmer-Friendly "Add Crop" Experience
- **Preset Image Gallery**: 14 high-resolution agricultural crop photography presets (Wheat, Basmati, Tomatoes, Nashik Onions, Guntur Chillies, Potatoes, Oranges, etc.) so farmers without camera files can publish in under 60 seconds.
- **Custom Image URL / File Upload**: Support for custom crop images.
- **Mandi Benchmark Indicator**: Real-time feedback comparing farmer rate against official APMC/MSP benchmarks.
- **100% Organic Certification Toggle**: Highlight chemical-free crops.

### 4. 🛒 Consumer Marketplace & Discovery
- **Multi-Factor Search**: Search by crop variety, farmer name, village, or district.
- **Filtering Engine**: Filter by Category (Grains, Vegetables, Fruits, Pulses, Spices, Oilseeds), District, and Organic status.
- **Dynamic Sorting**: Sort by lowest price, highest price, harvest recency, or available stock quantity.

### 5. ⚖️ Multi-Farmer Price Comparison
- Side-by-side comparison of different farmers offering the **exact same crop** (e.g. Sharbati Wheat from Punjab vs UP; Hybrid Tomatoes from Nashik vs Mysuru).
- Visual price distribution bars comparing farm rates with official Mandi rates.

### 6. 📞 Middleman-Free Direct Contact
- **Direct Phone Call**: Native `tel:` integration dialing the farmer's verified mobile number.
- **Direct WhatsApp Chat**: Pre-populated message with crop details and quantity ready to send via WhatsApp Web/App.
- **In-App Enquiry Form**: Submits purchase queries directly into the farmer's dashboard.

### 7. 🛡️ Admin & Moderation Portal
- Platform metrics: Total farmers, active crops, inquiry volume, covered districts.
- Content moderation: Flag and delete inappropriate or duplicate listings.
- Verified Farmers Directory.

---

## 🛠️ Technology Stack
- **Frontend Framework**: [React.js](https://react.dev/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/) (v6)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom agricultural palette (`farm`, `earth`, `harvest`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Cloud Database**: [Firebase v11](https://firebase.google.com/) (Auth, Cloud Firestore, Storage)
- **Deployment Target**: [Vercel](https://vercel.com/) / Static Hosting

---

## 📦 Project Structure

```
farmconnect/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CropCard.jsx             # Harvest listing card with badges & contact
│   │   ├── CropDetailModal.jsx      # Detailed crop view & alternative sellers
│   │   ├── DemoModeBanner.jsx       # Quick role switcher & setup guide
│   │   ├── EnquiryModal.jsx         # Direct consumer enquiry submission form
│   │   ├── Footer.jsx               # Agricultural helplines & disclaimers
│   │   ├── Navbar.jsx               # Responsive navigation & account menu
│   │   └── Toast.jsx                # Toast feedback system
│   ├── context/
│   │   ├── AuthContext.jsx          # Firebase Auth + Demo role switcher
│   │   └── MarketContext.jsx        # Firestore + LocalStorage crop CRUD & filters
│   ├── data/
│   │   ├── presetImages.js          # Curated crop photo presets & categories
│   │   ├── sampleCrops.js           # 12 authentic multi-district Indian crops
│   │   └── sampleFarmers.js         # Verified farmer profiles
│   ├── pages/
│   │   ├── AddCropPage.jsx          # Farmer crop publishing wizard
│   │   ├── AdminDashboardPage.jsx   # Moderation & platform metrics
│   │   ├── AuthModal.jsx            # Farmer registration & login
│   │   ├── BrowseCropsPage.jsx      # Consumer marketplace with multi-filters
│   │   ├── EditCropModal.jsx        # Instant listing update modal
│   │   ├── FarmerDashboardPage.jsx  # Farmer inventory & inquiries manager
│   │   ├── HomePage.jsx             # Hero, benefits, how-it-works, featured crops
│   │   └── PriceComparePage.jsx     # Side-by-side multi-farmer price comparison
│   ├── services/
│   │   └── firebase.js              # Safe Firebase configuration & fallback
│   ├── App.jsx                      # Main app shell & view router
│   ├── index.css                    # Tailwind directives & custom utilities
│   └── main.jsx                     # React DOM entry point
├── .env.example                     # Environment variables template
├── package.json
├── tailwind.config.js
├── vercel.json                      # Vercel SPA rewrite routing configuration
├── vite.config.js
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm** or **pnpm**

### 2. Installation
```bash
# Navigate to the project directory
cd farmconnect

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Firebase Configuration (Optional)

FarmConnect operates with 100% functionality in **Demo Mode** out of the box. To connect your live Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Cloud Firestore** in test or production mode.
4. Copy your Firebase web app credentials and create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Restart your dev server (`npm run dev`). FarmConnect will automatically detect the credentials and switch to Cloud Firestore!

---

## 🌐 Free Deployment to Vercel

FarmConnect is pre-configured for free 1-click deployment on [Vercel](https://vercel.com/):

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Option B: Deploy via GitHub
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - FarmConnect Agricultural Information System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/farmconnect.git
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your `farmconnect` repository.
4. Framework Preset: **Vite** (detected automatically).
5. (Optional) Add your Firebase environment variables under **Environment Variables**.
6. Click **Deploy**.

The bundled `vercel.json` ensures all client-side routes resolve properly to `/index.html`.

---

## 🏆 College Hackathon Demonstration Guide

For evaluators and judges:
1. **Explore as Farmer**: Notice the top bar has a 1-click **🌾 Farmer** button. Click it to immediately simulate Gurpreet Singh Dhillon's account.
2. **Publish a Crop**: Navigate to **Add Crop**, pick a preset image (e.g. *Fresh Red Tomatoes*), set price and quantity, and click **Publish**. Watch it instantly reflect in both the **Farmer Dashboard** and **Marketplace**!
3. **Price Comparison**: Click **Price Compare** in the navigation to see how different farmers selling *Sharbati Golden Wheat* or *Nashik Red Onions* compare against official Mandi rates.
4. **Consumer Experience**: Switch role to **🛒 Consumer**, search for crops by district (e.g. *Ludhiana* or *Nashik*), click **Call** or **WhatsApp**, or submit a direct enquiry.
5. **Admin Experience**: Switch to **🛡️ Admin** to view platform statistics and content moderation controls.

---

## 📄 License
This project is open-source under the MIT License.
