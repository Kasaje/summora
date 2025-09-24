# 📝 Summora

A modern user management web application built with Next.js, TypeScript, and MongoDB. Summora provides a complete authentication system with user registration, login, profile management, and account settings.

## ✨ Features

### 🔐 Authentication & Authorization

- **User Registration**: Create new accounts with username and password
- **Secure Login**: JWT-based authentication with access and refresh tokens
- **Password Security**: Bcrypt hashing for secure password storage
- **Protected Routes**: Authentication guards for secured pages

### 👤 User Management

- **Profile Page**: View and manage user profile information
- **Account Settings**: Comprehensive settings page with preferences
- **Account Deletion**: Secure account deletion with confirmation flow
- **User Status Tracking**: Active/inactive account status management

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Modern navbar with dropdown menus
- **Toast Notifications**: User-friendly feedback with react-hot-toast
- **Loading States**: Smooth loading indicators and transitions
- **Accessibility**: Focus states and keyboard navigation support

### 🛠️ Technical Features

- **TypeScript**: Full type safety throughout the application
- **MongoDB Integration**: Robust database connection and queries
- **API Routes**: RESTful API design with proper error handling
- **Context Management**: React Context for global state management
- **Server-Side Rendering**: Next.js App Router for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kasaje/summora.git
   cd summora
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
summora/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── user/            # User management endpoints
│   ├── home/                # Home page
│   ├── profile/             # User profile page
│   ├── register/            # Registration page
│   └── setting/             # Account settings page
├── components/              # Reusable UI components
│   └── Navbar/             # Navigation component
├── context/                 # React Context providers
│   └── AuthProvider.tsx    # Authentication context
├── lib/                     # Database and utility libraries
│   ├── mongodb.ts          # MongoDB connection
│   └── userConnection.ts   # User database operations
├── repository/              # Data access layer
│   └── userRepository.ts   # User data operations
├── service/                 # Business logic layer
│   ├── authService.ts      # Authentication services
│   └── userService.ts      # User services
└── utils/                   # Utility functions and hooks
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/refresh` - Refresh access token

### User Management

- `POST /api/user/register` - Register new user
- `POST /api/user/me` - Get current user profile
- `DELETE /api/user/delete` - Delete user account

## 🛠️ Built With

### Core Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - User interface library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database

### Styling & UI

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications

### Authentication & Security

- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing

### Development Tools

- **[ESLint 9](https://eslint.org/)** - Code linting and formatting
- **[Turbopack](https://turbo.build/)** - Fast bundler for development

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Alternative package managers
yarn dev / pnpm dev / bun dev
```

## 🌟 Key Features Walkthrough

### Authentication Flow

1. **Registration**: Users create accounts with username and secure password
2. **Login**: JWT tokens (access & refresh) manage authentication state
3. **Protected Navigation**: Context-based authentication guards

### Profile Management

- **View Profile**: Display user information with modern card layout
- **Account Settings**: Comprehensive settings with security options
- **Account Deletion**: Multi-step confirmation process for safety

### User Experience

- **Responsive Design**: Seamless experience across all device sizes
- **Toast Notifications**: Non-intrusive user feedback
- **Loading States**: Smooth transitions and loading indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kasaje** - [GitHub Profile](https://github.com/Kasaje)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution
- React Hot Toast for beautiful notifications

---

Made with ❤️ by [Kasaje](https://github.com/Kasaje)
