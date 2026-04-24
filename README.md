# 🛒 TechLand Frontend

A modern e-commerce platform built with Next.js 16, featuring a comprehensive product catalog, user authentication, admin panel, and AI-powered features.

## 🚀 Features

### 🛍️ Customer Features

- **Product Catalog**: Browse and search through a wide range of tech products
- **Product Details**: Detailed product information with images and specifications
- **Shopping Cart**: Add/remove products with real-time cart management
- **User Authentication**: Secure login/register with Google OAuth integration
- **Order Management**: Track orders and view order history
- **Product Reviews**: Read and write product reviews
- **AI Chat Assistant**: Get product recommendations and support
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👨‍💼 Admin Features

- **Admin Dashboard**: Comprehensive analytics and overview
- **Product Management**: Add, edit, and delete products
- **Category Management**: Organize products into categories
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer accounts
- **Review Management**: Moderate product reviews
- **AI Tools**: Generate product descriptions and tags

### 🎨 UI/UX Features

- **Dark/Light Theme**: Toggle between themes with next-themes
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Loading States**: Skeleton loaders for better perceived performance
- **Toast Notifications**: Real-time feedback with react-hot-toast

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Shadcn/ui
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: TanStack React Query
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Carousel**: Swiper.js
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Git for version control
- A running backend server (TechLand Backend)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tanimahamed07/techland-frontend.git
cd techland-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
techland-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin panel routes
│   │   ├── (auth)/            # Authentication routes
│   │   └── (public)/          # Public routes
│   ├── components/            # Reusable UI components
│   │   ├── admin-panel/       # Admin-specific components
│   │   ├── home/              # Homepage components
│   │   ├── products/          # Product-related components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # Base UI components
│   ├── service/               # API service functions
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   NEXTAUTH_URL=https://your-frontend-url.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔐 Authentication

The application uses NextAuth.js for authentication with the following providers:

- **Google OAuth**: Sign in with Google account
- **Credentials**: Email/password authentication

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Optimized mobile experience with drawer navigation

## 🎨 Theming

The application supports both light and dark themes:

- Automatic system preference detection
- Manual theme toggle
- Persistent theme selection

## 🔗 API Integration

The frontend communicates with the TechLand Backend API for:

- User authentication and management
- Product catalog and search
- Shopping cart operations
- Order processing
- Admin operations
- AI-powered features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/tanimahamed07)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Radix UI for accessible components
- Tailwind CSS for utility-first styling
- All contributors and the open-source community

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact us at support@techland.com
- Check our documentation

---

Made with ❤️ by the Tanim Ahamed
