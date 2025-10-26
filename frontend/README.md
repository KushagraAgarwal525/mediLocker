# MediLocker Frontend

A modern, secure React + TypeScript frontend for the MediLocker medical records management system with end-to-end encryption and AI-powered insights.

## 🚀 Features

- 🔐 **Client-side encryption** using Web Crypto API
- 🎨 **Modern UI** with Tailwind CSS and Radix UI
- 🔑 **Asymmetric encryption** for secure report storage
- 🤖 **AI report analysis** with real-time explanations
- 💊 **Medication compatibility warnings** before upload
- 📄 **PDF report upload and viewing**
- ⛓️ **Blockchain verification** integration
- 🎯 **Type-safe** with TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

## 🛠️ Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file:**
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:3000
   ```

   For production, set this to your deployed backend URL:
   ```env
   VITE_API_URL=https://your-backend-api.com
   ```

## 🎯 Quick Start

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # User login/connection page
│   │   ├── WelcomePage.tsx        # Main dashboard
│   │   └── ui/                    # Reusable UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       └── ...                # Other Radix UI components
│   ├── lib/
│   │   ├── config.ts              # API configuration
│   │   └── crypto.ts              # Encryption utilities
│   ├── styles/
│   │   └── globals.css            # Global styles
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Tailwind CSS imports
│   └── vite-env.d.ts             # TypeScript environment types
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                # Vite configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── .env.example                  # Environment variables template
```

## 🔧 Key Components

### LoginPage
- User authentication/connection
- Username input and validation
- Animated UI with gradient effects

### WelcomePage
- Medical records dashboard
- Upload new reports (PDF)
- View existing reports
- AI-powered report analysis
- Medication compatibility checking
- Blockchain verification display

### Encryption (lib/crypto.ts)
- Asymmetric key generation (RSA-OAEP)
- Public/private key management
- Secure encryption/decryption
- IndexedDB key storage

### Configuration (lib/config.ts)
- Centralized API endpoint management
- Environment variable handling
- Type-safe configuration

## 📦 Dependencies

### Core Dependencies
- **react** - UI library
- **react-dom** - React DOM rendering
- **typescript** - Type safety
- **lucide-react** - Icon library
- **react-markdown** - Markdown rendering for AI responses
- **remark-gfm** - GitHub Flavored Markdown support

### UI Components
- **@radix-ui/react-*** - Accessible UI primitives
- **class-variance-authority** - CSS class management
- **tailwind-merge** - Tailwind class merging
- **clsx** - Conditional class names

### Build Tools
- **vite** - Fast build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **tailwindcss** - Utility-first CSS framework
- **postcss** - CSS processing
- **autoprefixer** - CSS vendor prefixing

## 🎨 Styling

This project uses:
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Custom CSS** for animations and effects
- **Dark theme** with purple/blue gradient accents

### Customization

Modify `src/styles/globals.css` for theme customization:
- Color schemes
- Typography
- Spacing
- Animations

## 🔒 Security Features

### Client-Side Encryption
```typescript
// Generate key pair for user
const { publicKey, privateKey } = await crypto.ensureKeyPairForUser(userId);

// Encrypt data before upload
const encrypted = await crypto.encryptWithPublicKey(publicKey, fileData);

// Decrypt when viewing
const decrypted = await crypto.decryptWithPrivateKey(privateKey, encrypted);
```

### Key Storage
- Private keys stored in IndexedDB
- Never transmitted to server
- Isolated per user session

### HTTPS
Always use HTTPS in production to prevent man-in-the-middle attacks.

## 🌐 Environment Variables

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://api.medilocker.com
```

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the frontend.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Platforms

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### Static Hosting
Upload the `dist/` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

### Environment Variables in Production

Set `VITE_API_URL` in your hosting platform's environment configuration.

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

## 🎯 Features in Detail

### Upload Medical Reports
1. Click "Add New Report"
2. Select PDF file
3. Enter report date
4. System checks medication compatibility
5. Report encrypted and uploaded to blockchain
6. Receive confirmation with transaction hash

### View Reports
- Table view of all reports
- View individual reports in browser
- Decrypt automatically with private key
- Display blockchain verification info

### AI Analysis
- Click "Explain" on any report
- AI analyzes medical data
- Provides insights and recommendations
- Markdown formatted response

### Medication Compatibility
- Automatic checking before upload
- Analyzes against existing prescriptions
- Alerts for interactions
- Suggests alternatives if needed

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Connection Errors
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend

### Encryption Errors
- Clear IndexedDB in browser DevTools
- Regenerate key pair by logging in again
- Check browser console for errors

### TypeScript Errors
```bash
# Update TypeScript definitions
npm install --save-dev @types/node
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires Web Crypto API support
- Requires IndexedDB support

## 🔧 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR - changes reflect immediately without full reload.

### DevTools
- React DevTools extension recommended
- Use browser console for debugging
- Network tab for API monitoring

### Component Development
All UI components are in `src/components/ui/` and follow Radix UI patterns.

## 📄 License

ISC

## 🤝 Contributing

Contributions welcome! Please:
- Follow TypeScript best practices
- Use existing component patterns
- Test on multiple browsers
- Update documentation

## 🔗 Related Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 📞 Support

For issues and questions:
- Check backend connectivity first
- Review browser console errors
- Verify environment variables
- Create an issue in the repository
