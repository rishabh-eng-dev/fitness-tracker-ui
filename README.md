# Workout Tracker App

A comprehensive React-based workout tracking application with Google OAuth2 authentication, workout management, scheduling, and AI chatbot integration.

## Features

### ✅ Completed Features

1. **Authentication System**

   - Google OAuth2 integration
   - Structured authentication module
   - User session management
   - Protected routes

2. **User Interface**

   - Modern Material-UI design
   - Responsive layout with header, footer, and sidebar
   - Mobile-friendly burger menu navigation
   - Card-based workout display

3. **Workout Management**

   - Create and edit workouts
   - Exercise tracking with sets, reps, weight, and duration
   - Workout categories (cardio, strength, flexibility, mixed)
   - Difficulty levels (beginner, intermediate, advanced)

4. **Workout Scheduling**

   - Create workout schedules
   - Assign workouts to specific days and times
   - Track completion status
   - Schedule management (create, edit, delete)

5. **AI Chatbot Interface**

   - Interactive chat interface
   - Mock AI responses for fitness advice
   - Ready for future AI integration
   - Suggested questions and conversation flow

6. **Dashboard**
   - Overview of workout statistics
   - Recent activity tracking
   - Quick action buttons
   - Progress visualization

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Console account (for OAuth2)

### Installation

1. **Clone and install dependencies:**

   ```bash
   cd workout-app
   npm install
   ```

2. **Set up Google OAuth2:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth2 credentials
   - Add `http://localhost:3000` to authorized origins
   - Copy the Client ID

3. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Google Client ID:

   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Footer.tsx       # Page footer
│   ├── Layout.tsx       # Main layout wrapper
│   ├── WorkoutCard.tsx  # Workout display card
│   ├── WorkoutList.tsx  # Workout list component
│   ├── WorkoutRegistrationForm.tsx # Workout creation form
│   ├── WorkoutSchedule.tsx # Schedule management
│   └── Chatbot.tsx      # AI chatbot interface
├── pages/               # Page components
│   ├── LoginPage.tsx    # Authentication page
│   └── DashboardPage.tsx # Main dashboard
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── services/            # API and external services
│   └── authService.ts   # Google OAuth2 service
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   └── workout.ts       # Workout-related types
└── App.tsx              # Main application component
```

## Technology Stack

- **Frontend:** React 18 with TypeScript
- **UI Framework:** Material-UI (MUI)
- **Authentication:** Google OAuth2
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Styling:** Emotion (MUI's styling solution)

## Future Enhancements

### Backend Integration

- REST API integration for data persistence
- User profile management
- Workout history and analytics
- Social features (sharing workouts)

### AI Features

- Real AI chatbot integration
- Personalized workout recommendations
- Form analysis and feedback
- Nutrition advice

### Additional Features

- Workout timer and rest periods
- Progress photos and measurements
- Workout templates and presets
- Export/import functionality
- Mobile app (React Native)

## Development Notes

### Authentication Flow

The app uses Google OAuth2 for authentication. The `authService.ts` handles the OAuth2 flow and manages user sessions using localStorage.

### Data Management

Currently uses mock data service. In production, this would be replaced with API calls to a backend service.

### Responsive Design

The app is fully responsive and works on desktop, tablet, and mobile devices. The sidebar automatically converts to a drawer on mobile.

### Type Safety

Full TypeScript implementation ensures type safety across the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
