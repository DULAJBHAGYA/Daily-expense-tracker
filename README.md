# WeSpend - Daily Expense Tracker

A modern, responsive expense tracking application with dark mode, customizable dashboard widgets, real-time updates, and mobile-optimized design.

## 🚀 Features

### ✨ New Features Added
- **🌙 Dark Mode Toggle**: Switch between light and dark themes with persistent preference
- **📊 Customizable Dashboard Widgets**: Add, remove, and customize dashboard widgets
- **📱 Mobile-Responsive Design**: Optimized for all screen sizes with touch-friendly interface
- **🎨 Modern UI**: Beautiful, accessible design with smooth transitions
- **⚡ Real-Time Updates**: Instant data updates without page reloads
- **🔔 Smart Notifications**: Success and error notifications with visual feedback
- **📈 Enhanced Analytics**: Real-time calculations and percentage changes
- **🎯 Interactive Landing Page**: Engaging landing page with animated elements

### 📈 Core Features
- **Daily Expense Tracking**: Add, edit, and delete expenses with categories
- **Income Tracking**: Track both expenses and income
- **Monthly Overview**: View monthly summaries and trends
- **Statistics & Charts**: Visual charts for expense analysis
- **User Authentication**: Secure login with Clerk
- **Real-Time Dashboard**: Live updates with loading indicators
- **Category Management**: Predefined categories with validation
- **Data Persistence**: All data saved to MongoDB

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Clerk** for authentication
- **Chart.js** for data visualization
- **Zustand** for state management
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** enabled for cross-origin requests
- **RESTful API** with comprehensive endpoints

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

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persistent theme preference using localStorage
- Smooth transitions and animations
- Optimized colors for both themes
- Automatic theme detection

### 📊 Customizable Dashboard
- **Widget Types**: 
  - Today's Expenses
  - Today's Incomes
  - Monthly Balance
  - Savings Rate
  - Total Savings
- **Add/Remove Widgets**: Customize your dashboard layout
- **Real-Time Calculations**: Live percentage changes and trends
- **Persistent Layout**: Widget configurations are saved
- **Interactive Elements**: Hover effects and animations

### ⚡ Real-Time Updates
- **Instant UI Updates**: Changes appear immediately without reload
- **Optimistic Updates**: UI updates before server confirmation
- **Server Synchronization**: Ensures data accuracy
- **Loading States**: Visual feedback during operations
- **Success Notifications**: Confirmation messages for user actions

### �� Mobile Responsive
- **Mobile-First Design**: Optimized for small screens
- **Touch-Friendly**: Larger touch targets and better spacing
- **Responsive Charts**: Charts adapt to screen size
- **Collapsible Navigation**: Mobile menu with hamburger icon
- **Card vs Table Views**: Mobile shows cards, desktop shows tables

### 🎨 Enhanced Landing Page
- **Animated Background**: Blob animations and gradient effects
- **Interactive Elements**: Floating cards and mobile preview
- **Green Blob Background**: Dynamic background elements
- **Professional Design**: Modern, attractive interface
- **Call-to-Action**: Clear "Get Started" button

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
- **useCallback Optimization**: Memoized functions for better performance

### Interactive Elements
- **Hover Effects**: Smooth hover animations
- **Loading Spinners**: Visual feedback during operations
- **Success Indicators**: Green checkmarks and notifications
- **Error Handling**: Clear error messages and retry options

## 🔧 Development

### Project Structure
```
Daily-expense-tracker/
├── tracker-client/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── dashboard/  # Dashboard page
│   │   │   ├── sign-in/    # Authentication pages
│   │   │   └── sign-up/    # Registration pages
│   │   ├── components/     # React components
│   │   │   ├── daily.tsx   # Daily expenses component
│   │   │   ├── monthly.tsx # Monthly overview component
│   │   │   ├── stats.tsx   # Statistics and charts
│   │   │   ├── ThemeToggle.tsx # Dark mode toggle
│   │   │   └── CustomizableDashboard.tsx # Dashboard widgets
│   │   └── utils/          # Utilities and API
│   │       ├── api.ts      # API configuration
│   │       └── theme.ts    # Theme management
│   └── public/             # Static assets
├── tracker-server/          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   │   └── expenseControllers.js # Expense CRUD operations
│   │   ├── models/         # MongoDB models
│   │   │   └── expense.js  # Expense schema
│   │   ├── routes/         # API routes
│   │   │   └── expenseRoutes.js # Expense endpoints
│   │   └── utils/          # Utilities
│   │       └── db.js       # Database connection
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

#### API Integration
- `src/utils/api.ts` - Axios instance with proper configuration
- Real-time data fetching and updates
- Error handling and retry logic

#### Responsive Components
- All components include mobile-responsive classes
- Conditional rendering for mobile/desktop views
- Touch-friendly interactions

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

## 🎯 Recent Updates

### Version 2.0 Features
- ✅ **Real-Time Updates**: Instant data synchronization
- ✅ **Enhanced Landing Page**: Beautiful, interactive design
- ✅ **Improved Mobile Experience**: Better responsive design
- ✅ **Smart Notifications**: User feedback for all operations
- ✅ **Performance Optimizations**: Faster loading and updates
- ✅ **Better Error Handling**: Graceful error management
- ✅ **Category Validation**: Proper category management
- ✅ **Loading States**: Visual feedback during operations

---

**WeSpend** - Take control of your finances with style! 💰✨