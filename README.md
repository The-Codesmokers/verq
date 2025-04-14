# VerQ - AI-Powered Mock Interview Platform

VerQ is an AI-powered mock interview platform that generates personalized interview questions based on a user's resume and target role, captures voice responses, and provides AI feedback.

## Links
FRONTEND: https://verqai.vercel.app
BACKEND: https://verq.onrender.com
PPT: https://www.canva.com/design/DAGkh628bOc/_F6BjT6a8UIxzT5oV7_Swg/edit?utm_content=DAGkh628bOc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton


## Features
- Resume-based interview question generation
- Voice response recording and transcription
- AI-powered feedback and evaluation
- Real-time interview experience
- Multiple AI model support (OpenAI GPT-4, Google Gemini)
- Text-to-speech capabilities

## Tech Stack
### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Firebase Authentication
- Web Speech API

### Backend
- Node.js + Express
- MongoDB
- Google Gemini API
- Deepgram API
- Firebase Admin SDK

## Project Structure
```
verq/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
├── PLANNING.md        # Project planning and roadmap
└── TASKS.md          # Task tracking and management
```

## Environment Variables Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory (`verq/backend/.env`):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Firebase Admin SDK Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key_here"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_x509_cert_url
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory (`verq/frontend/.env`):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### Getting API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add the key to `backend/.env` as `GEMINI_API_KEY`

2. **Deepgram API Key**:
   - Visit [Deepgram Console](https://console.deepgram.com)
   - Create an account and generate an API key
   - Add the key to `backend/.env` as `DEEPGRAM_API_KEY`

3. **Firebase Configuration**:
   - Create a project in [Firebase Console](https://console.firebase.google.com)
   - Add a web app to your project
   - Copy the configuration object
   - Add the values to both `frontend/.env` and `backend/.env`
   - For backend, download the service account key and add its values to `backend/.env`

4. **MongoDB Connection String**:
   - Create a cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get the connection string
   - Add it to `backend/.env` as `MONGODB_URI`

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure the `.env` file as described above

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure the `.env` file as described above

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run test-pdf` - Test PDF processing functionality
- `npm run extract-pdf` - Extract text from PDF
- `npm run test-tts` - Test text-to-speech functionality
- `npm run generate-question-tts` - Generate question and convert to speech
- `npm run interview` - Run the interview workflow

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## API Endpoints

### Interview Flow
- `POST /api/resume` - Submit resume text and job role
- `POST /api/questions` - Generate interview questions
- `POST /api/answers` - Submit voice answer transcript
- `POST /api/feedback` - Get AI evaluation of answer


## License
This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Google for Gemini API
- Deepgram for Text-to-Speech API
- Firebase for Authentication and Storage
- MongoDB for Database
