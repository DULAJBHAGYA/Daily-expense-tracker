# WeSpend - Daily Expense Tracker

A modern, responsive expense tracking application with dark mode, customizable dashboard widgets, and mobile-optimized design.

## 🚀 Features

### ✨ New Features Added
- **🌙 Dark Mode Toggle**: Switch between light and dark themes with persistent preference
- **📊 Customizable Dashboard Widgets**: Add, remove, and customize dashboard widgets
- **📱 Mobile-Responsive Design**: Optimized for all screen sizes with touch-friendly interface
- **🎨 Modern UI**: Beautiful, accessible design with smooth transitions

### 📈 Core Features
- **Daily Expense Tracking**: Add, edit, and delete expenses with categories
- **Income Tracking**: Track both expenses and income
- **Monthly Overview**: View monthly summaries and trends
- **Statistics & Charts**: Visual charts for expense analysis
- **User Authentication**: Secure login with Clerk

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Clerk** for authentication
- **Chart.js** for data visualization
- **Zustand** for state management
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Daily-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd tracker-server
   npm install
   
   # Install frontend dependencies
   cd ../tracker-client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both directories:
   
   **tracker-server/.env:**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   PORT=4000
   ```
   
   **tracker-client/.env.local:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

### Running the Application

#### Option 1: Quick Start (Recommended)
```bash
# From the root directory
./start-app.sh
```

#### Option 2: Manual Start
```bash
# Start the backend server
cd tracker-server
npm start

# In a new terminal, start the frontend
cd tracker-client
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 🎯 Features in Detail

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions
- Optimized colors for both themes

### Customizable Dashboard
- **Widget Types**: Expenses, Income, Balance, Savings Goal, Total Savings
- **Add/Remove Widgets**: Customize your dashboard layout
- **Drag & Drop Ready**: Prepared for future drag-and-drop functionality
- **Persistent Layout**: Widget configurations are saved

### Mobile Responsive
- **Mobile-First Design**: Optimized for small screens
- **Touch-Friendly**: Larger touch targets and better spacing
- **Responsive Charts**: Charts adapt to screen size
- **Collapsible Navigation**: Mobile menu with hamburger icon
- **Card vs Table Views**: Mobile shows cards, desktop shows tables

## 📱 Mobile Features

### Responsive Design
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: Grid layouts that adapt to screen size
- **Touch Optimization**: Larger buttons and better spacing
- **Performance**: Optimized for mobile performance

### Mobile-Specific UI
- **Hamburger Menu**: Collapsible navigation for mobile
- **Card Layout**: Mobile-friendly expense cards
- **Touch Gestures**: Swipe-friendly interface
- **Responsive Typography**: Text scales appropriately

## 🎨 UI/UX Improvements

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Focus States**: Clear focus indicators
- **Color Contrast**: WCAG compliant color ratios

### Performance
- **Lazy Loading**: Components load on demand
- **Optimized Images**: Next.js Image optimization
- **Smooth Transitions**: CSS transitions for better UX
- **Error Boundaries**: Graceful error handling

## 🔧 Development

### Project Structure
```
Daily-expense-tracker/
├── tracker-client/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── utils/          # Utilities and API
│   └── public/             # Static assets
├── tracker-server/          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utilities
│   └── package.json
└── README.md
```

### Key Components

#### Theme Management
- `src/utils/theme.ts` - Zustand store for theme state
- `src/components/ThemeProvider.tsx` - Theme provider component
- `src/components/ThemeToggle.tsx` - Theme toggle button

#### Dashboard Widgets
- `src/components/DashboardWidget.tsx` - Individual widget component
- `src/components/CustomizableDashboard.tsx` - Main dashboard with widget management

#### Responsive Components
- All components include mobile-responsive classes
- Conditional rendering for mobile/desktop views
- Touch-friendly interactions

## 🐛 Troubleshooting

### Common Issues

1. **404 API Errors**
   - Ensure the backend server is running on port 4000
   - Check that MongoDB is connected
   - Verify API routes are correct

2. **Theme Not Persisting**
   - Check browser localStorage
   - Ensure ThemeProvider is wrapping the app

3. **Mobile Layout Issues**
   - Clear browser cache
   - Check responsive breakpoints
   - Verify Tailwind classes

### Debug Mode
The application includes console logging for debugging:
- API calls are logged with request/response data
- Theme changes are logged
- Widget interactions are tracked

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd tracker-client
npm run build
```

### Backend (Railway/Heroku)
```bash
cd tracker-server
npm start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**WeSpend** - Take control of your finances with style! 💰✨