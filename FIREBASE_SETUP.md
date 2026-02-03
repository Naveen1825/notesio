# Firebase Authentication Setup

This application now includes Firebase email and Google authentication with login/signup functionality.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment Variables

Create a `.env.local` file in the root of your project with the following Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBiVFP_yl_TtaNIS4dBy9oB1H7rK8CotlE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sudoku-2ecb4.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sudoku-2ecb4
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sudoku-2ecb4.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=65669963629
NEXT_PUBLIC_FIREBASE_APP_ID=1:65669963629:web:c22a3ef8a7cadb6da6c464
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Z3497VXCF6
```

### 3. Configure Google Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`sudoku-2ecb4`)
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Google** provider:
   - Click on **Google**
   - Enable the toggle
   - Add your project's authorized domains:
     - `localhost` (for development)
     - `yourdomain.com` (for production)
   - Click **Save**

### 4. Run the Application

```bash
npm run dev
```

## Authentication Flow

1. **Home Page (`/`)**: Redirects to:
   - `/notes` if user is authenticated
   - `/auth/login` if user is not authenticated

2. **Login Page (`/auth/login`)**: 
   - Email and password authentication
   - Google OAuth authentication
   - Redirects to `/notes` on successful login
   - Link to signup page

3. **Signup Page (`/auth/signup`)**:
   - Create new account with email and password
   - Google OAuth authentication
   - Password confirmation
   - Redirects to `/notes` on successful signup

4. **Notes Page (`/notes`)**:
   - Protected route - requires authentication
   - Shows user email and logout button
   - Full notes functionality

## Features

- ✅ Email authentication
- ✅ Google OAuth authentication
- ✅ Protected routes
- ✅ User session management
- ✅ Automatic redirects
- ✅ Logout functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design matching app theme

## File Structure

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx          # Login page with Google auth
│   └── signup/
│       └── page.tsx          # Signup page with Google auth
├── notes/
│   └── page.tsx              # Protected notes page
├── page.tsx                  # Home page with redirects
└── layout.tsx                # Root layout

components/
└── protected-route.tsx       # Route protection wrapper

contexts/
└── auth-context.tsx          # Authentication context

lib/
└── firebase.ts               # Firebase configuration with Google provider
```

## Security Notes

- Firebase API keys are public (client-side) by design
- Authentication rules should be configured in Firebase console
- Environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Never expose Firebase service account keys or private keys in client code
- Google OAuth requires proper domain configuration in Firebase Console

## Google OAuth Configuration

For Google authentication to work properly:

1. **Development**: Add `localhost` to authorized domains
2. **Production**: Add your production domain
3. **OAuth Consent Screen**: Configure in Google Cloud Console if needed
4. **Redirect URLs**: Firebase automatically handles these for web apps

## Troubleshooting

- **Google Sign-In not working**: Check that Google provider is enabled in Firebase Console
- **Domain errors**: Ensure your domain is added to authorized domains
- **CORS issues**: Verify proper Firebase configuration
- **Environment variables**: Ensure all Firebase config values are set correctly
