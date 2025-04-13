# verq

## Backend Setup and Running Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Backend
1. For development (with auto-reload):
   ```bash
   npm run dev
   ```

2. For production:
   ```bash
   npm start
   ```

### Adding the path of the pdf to be extracted
  ```bash
   npm run extract-pdf "/path/to/your/file"
   ```

The backend server will start on port 3000 by default. Make sure to set up your environment variables in a `.env` file if required.

### API Endpoints
- The backend provides REST API endpoints for PDF processing and data extraction
- File uploads are handled through multipart/form-data
- Processed files are stored in the `uploads` directory

### Project Structure
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── server.js      # Main application entry point
│   └── extract-pdf.js # PDF processing logic
├── uploads/           # Directory for uploaded files
└── package.json       # Project dependencies and scripts
```