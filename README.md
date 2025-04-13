# verq

## Backend Setup and Running Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenAI API key (for AI-generated questions)
- Gemini API key (for alternative AI-generated questions)

### Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API keys and configuration:
   ```
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # File Upload Configuration
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880  # 5MB in bytes

   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Note: The following variables are prepared for future use (currently commented out in the code):
   ```
   # Database Configuration
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=verq_db
   # DB_USER=your_db_user
   # DB_PASSWORD=your_db_password

   # JWT Configuration
   # JWT_SECRET=your_jwt_secret
   # JWT_EXPIRES_IN=24h
   ```

### API Key Setup

#### OpenAI API Key
To use the AI-generated interview questions feature with OpenAI:

1. Sign up for an OpenAI account at https://platform.openai.com/signup
2. Create an API key in your OpenAI dashboard
3. Add the API key to your `.env` file as `OPENAI_API_KEY=your_key_here`
4. Make sure your OpenAI account has sufficient credits or billing information set up

#### Gemini API Key
As an alternative to OpenAI, you can use Google's Gemini API:

1. Visit the Google AI Studio at https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add the API key to your `.env` file as `GEMINI_API_KEY=your_key_here`

If neither OpenAI nor Gemini API keys are available or if you encounter quota issues, the system will automatically generate a fallback question based on the resume content.

### Running the Backend
1. For development (with auto-reload):
   ```bash
   npm run dev
   ```

2. For production:
   ```bash
   npm start
   ```

### Processing PDFs and Generating Questions
To process a PDF and generate an interview question:
```bash
npm run extract-pdf "/path/to/your/file.pdf"
```

This will:
1. Extract text from the PDF
2. Save the extracted text to a file
3. Generate a technical interview question based on the content using OpenAI (if available)
4. If OpenAI is unavailable, generate a fallback question based on the resume content
5. Display both the extracted text and the generated question

The backend server will start on port 3000 by default. Make sure to set up your environment variables in a `.env` file if required.

### API Endpoints
- The backend provides REST API endpoints for PDF processing and data extraction
- File uploads are handled through multipart/form-data
- Processed files are stored in the `uploads` directory

### Project Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   └── config.js   # Environment variables and app configuration
│   ├── controllers/    # Request handlers
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   │   ├── pdfService.js    # PDF processing
│   │   └── openaiService.js # OpenAI integration
│   ├── utils/         # Utility functions
│   ├── server.js      # Main application entry point
│   └── extract-pdf.js # PDF processing logic
├── uploads/           # Directory for uploaded files
├── .env              # Environment variables
└── package.json      # Project dependencies and scripts
```

## Frontend Setup and Running Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Frontend
1. For development (with hot module replacement):
   ```bash
   npm run dev
   ```

2. For production build:
   ```bash
   npm run build
   ```

3. To preview the production build:
   ```bash
   npm run preview
   ```

The frontend development server will start on port 5173 by default. Make sure the backend server is running on port 3000 for the API calls to work correctly.

### Frontend Project Structure
```
frontend/
├── src/
│   ├── assets/        # Static assets (images, 3D models)
│   ├── components/    # Reusable React components
│   ├── contexts/      # React context providers
│   ├── pages/         # Page components
│   ├── routes/        # Route definitions
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Public static files
├── index.html         # HTML template
└── package.json       # Project dependencies and scripts
```

### Features
- Modern React with Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- 3D scene integration with Spline
- Responsive design
- Custom font integration