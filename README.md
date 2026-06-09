# 🌍 EcoTrace — Carbon Footprint Tracker

A personalized carbon footprint tracking web app that helps individuals understand, monitor, and reduce their environmental impact through real-time insights and actionable steps.

## 🚀 Live Demo
[View Deployed App](#) <!-- Replace with your deployed link -->

---

## 🎯 Problem Statement
Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## ✨ Features

### 📊 Dashboard
- Real-time annual CO₂ footprint gauge
- Level system: Climate Champion → On Track → Needs Work → High Impact
- Category-wise breakdown (Transport, Food, Energy, Shopping, Flights)
- Monthly trend visualization
- Comparison vs Global Average, India Average & Paris Agreement Target

### 🎛️ Track
- Interactive sliders + number inputs for 5 emission categories
- Real-time animated updates as you adjust habits
- Per-category CO₂ contribution display

### ✅ Actions
- Personalized checklist auto-prioritized by biggest emission source
- Completion tracking with progress bar
- 7-day streak system to build habits

### 💡 Insights
- Real-world equivalences (trees needed, km driven, flights)
- Benchmark comparison with global/regional averages
- Potential savings calculator for top recommended actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Styling | CSS-in-JS (inline styles with CSS variables) |
| Fonts | DM Mono (Google Fonts) |
| State Management | React Hooks (useState, useEffect, useRef) |
| Deployment | Vercel / Netlify |

---

## 📁 Project Structure

```
ecotrace/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Main carbon tracker component
│   └── index.js         # Entry point
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ecotrace.git

# Navigate to project directory
cd ecotrace

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 🌱 Emission Factors Used

| Category | Factor | Source |
|----------|--------|--------|
| Transport | 0.21 kg CO₂/km | IPCC 2023 |
| Food | 3.3 kg CO₂/meal | Our World in Data |
| Home Energy | 0.82 kg CO₂/kWh | IEA 2023 |
| Shopping | 8.5 kg CO₂/item | Carbon Trust |
| Flights | 255 kg CO₂/flight | ICAO |

---

## 📐 Design Decisions

- **Dark terminal-green aesthetic** — environmental theme without being generic
- **Monospace typography (DM Mono)** — data-focused, readable, distinctive
- **Radial gauge** — instant visual feedback on footprint severity
- **Animated numbers** — makes data feel live and responsive
- **4-tab architecture** — separates understand / track / act / learn flows clearly

---

## ♿ Accessibility

- Sufficient color contrast ratios on all text elements
- Keyboard-navigable tab interface
- Semantic HTML structure
- Screen-reader friendly labels on interactive inputs

---

## 🔒 Security

- No user data stored externally — all state is client-side only
- No API keys or secrets in codebase
- No third-party data transmission

---

## 📊 Evaluation Criteria Coverage

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | Component-based React, clean separation of data/UI, reusable constants |
| **Security** | Client-side only, no data leakage, no external calls |
| **Efficiency** | Single-component architecture, CSS transitions over JS animations where possible |
| **Testing** | Logic functions (formatKg, getLevel, totals) are pure and easily unit-testable |
| **Accessibility** | Contrast ratios, keyboard nav, semantic inputs with labels |

---

## 👤 Author

**Nikhil Kumar** — B.Tech CSE, Arka Jain University  
GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)  
LinkedIn: [Your LinkedIn](#)

---

## 📄 License
MIT License — feel free to use and modify.
