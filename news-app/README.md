# News App with Next.js and NextAuth

A modern news application built with Next.js 15, featuring user authentication, password reset functionality, and real-time news updates using external APIs.

## 🚀 Features

- **User Authentication**

  - Email/Password Sign Up & Sign In
  - Password Reset Flow
  - Protected Routes

- **News Integration**

  - Real-time News Updates
  - Category-based Filtering
  - Search Functionality
  - Responsive News Cards

- **Modern UI**
  - Material-UI Components
  - Responsive Design
  - Tailwind CSS Integration

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 15 (App Router)
  - Material-UI
  - Tailwind CSS
  - NextAuth.js

- **Backend**

  - Next.js API Routes
  - MongoDB
  - Mongoose

- **Authentication**
  - NextAuth.js
  - JWT Tokens
  - Bcrypt for Password Hashing

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Netixsol-Innovator-Internship/Hassan-Mujahid/tree/main/Full-Stack-NEXTJS-Hackathon/next-app
cd news-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
# App
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-nextauth-secret

# MongoDB
MONGODB_URI=your-mongodb-uri

# News API
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
```

# Password-Reset

```env
EMAIL_SERVER_HOST=smtp.your-email-host
EMAIL_SERVER_PORT=your-email-port
EMAIL_SERVER_USER=your-email-user
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=your-email-from
```

4. **Start the development server**

```bash
npm run dev
```

## 🔐 Authentication Flow

### Email/Password Authentication

1. **Sign Up**

   - User submits email and password
   - Password is hashed using bcrypt
   - User data is stored in MongoDB
   - User is redirected to sign-in page

2. **Sign In**

   - User provides credentials
   - Server validates credentials
   - JWT token is generated
   - User is redirected to dashboard

3. **Password Reset**
   - User requests password reset
   - Reset token is generated and stored
   - Reset link is sent to email
   - User sets new password using token

## 🔄 API Integration

### News API

```javascript
// Example API call
const fetchNews = async (category = "all") => {
  const res = await fetch(`/api/news?category=${category}`);
  return res.json();
};
```

### Authentication API Routes

```javascript
// Sign Up
POST / api / auth / signup;
Body: {
  username, email, password;
}

// Password Reset Request
POST / api / auth / forgot - password;
Body: {
  email;
}

// Password Reset
POST / api / auth / reset - password;
Body: {
  token, password;
}
```

## 🔒 Protected Routes

Protected routes are handled using Next.js middleware:

```javascript
// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/sign-up", "/sign-in"],
};
```

## 🎨 Styling

The app uses a combination of Material-UI and Tailwind CSS:

```javascript
// theme.js
const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    // ... other typography settings
  },
  palette: {
    primary: {
      main: "#37b24d",
    },
    // ... other palette settings
  },
});
```

## 📱 Responsive Design

The app is fully responsive and works on all screen sizes:

- Mobile-first approach
- Responsive navigation
- Adaptive news cards
- Flexible layouts

## 🚀 Deployment

1. **Vercel Deployment**

```bash
vercel deploy
```

2. **Environment Variables**
   - Set all environment variables in Vercel dashboard
   - Enable automatic deployments
   - Configure custom domains if needed

## 👥 Authors

Live-site: [Live-site](https://next-app-seven-sand.vercel.app/)
