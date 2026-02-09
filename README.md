# Interactive Question Management Sheet

A single-page web application built with the MERN stack that enables users to manage a hierarchical set of questions categorized by topics and sub-topics. The application features drag-and-drop reordering, CRUD operations, and a clean, intuitive user interface.

## Features

- ✅ **Add/Edit/Delete Topics**: Manage topics at the top level
- ✅ **Add/Edit/Delete Sub-topics**: Organize questions under topics
- ✅ **Add/Edit/Delete Questions**: Add questions with title, link, and difficulty
- ✅ **Drag-and-Drop Reordering**: Reorder topics, sub-topics, and questions by dragging
- ✅ **Clean UI**: Modern, responsive design with Tailwind CSS
- ✅ **State Management**: Zustand for efficient state management
- ✅ **RESTful API**: Full CRUD operations via Express backend

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Zustand (State Management)
- React Beautiful DnD (Drag and Drop)
- Lucide React (Icons)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- CORS enabled
- In-memory data storage (can be easily extended to MongoDB)

## Project Structure

```
.
├── backend/
│   ├── server.js          # Express server with all API routes
│   ├── package.json
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand store
│   │   ├── api/           # API client and functions
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to port 5000):
```
PORT=5000
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Sheet Operations
- `GET /api/question-tracker/v1/sheet/public/get-sheet-by-slug/:slug` - Get sheet by slug
- `GET /api/sheet` - Get entire sheet
- `PUT /api/sheet` - Update entire sheet
- `PUT /api/sheet/reorder` - Reorder elements

### Topic Operations
- `POST /api/topics` - Create topic
- `PUT /api/topics/:topicId` - Update topic
- `DELETE /api/topics/:topicId` - Delete topic

### Sub-topic Operations
- `POST /api/topics/:topicId/subtopics` - Create sub-topic
- `PUT /api/topics/:topicId/subtopics/:subtopicId` - Update sub-topic
- `DELETE /api/topics/:topicId/subtopics/:subtopicId` - Delete sub-topic

### Question Operations
- `POST /api/topics/:topicId/subtopics/:subtopicId/questions` - Create question
- `PUT /api/topics/:topicId/subtopics/:subtopicId/questions/:questionId` - Update question
- `DELETE /api/topics/:topicId/subtopics/:subtopicId/questions/:questionId` - Delete question

## Usage

1. **Adding a Topic**: Click the "Add Topic" button at the top of the page
2. **Adding a Sub-topic**: Click "Add Sub-topic" button within a topic
3. **Adding a Question**: Click the "+" icon within a sub-topic
4. **Editing**: Click the edit icon or click on the title to edit inline
5. **Deleting**: Click the delete icon and confirm
6. **Reordering**: Drag and drop items using the grip handle (⋮⋮) on the left

## Sample Data

The application comes with sample data including:
- Arrays topic with Easy and Medium sub-topics
- Linked List topic with Easy sub-topic
- Sample questions with links and difficulty levels

## Notes

### React 18 and react-beautiful-dnd
The application uses `react-beautiful-dnd` which may show some console warnings in development mode due to React 18's StrictMode. These warnings don't affect functionality. If you encounter issues, you can temporarily remove `<React.StrictMode>` from `frontend/src/index.js`.

### Data Persistence
Currently, the backend uses in-memory storage. Data will be lost when the server restarts. To add persistent storage:
1. Install MongoDB and mongoose
2. Create models for Sheet, Topic, Subtopic, and Question
3. Update the API endpoints to use database operations

## Quick Start

1. **Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm start
```

2. **Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install
npm start
```

3. Open `http://localhost:3000` in your browser

## Future Enhancements

- MongoDB integration for persistent storage
- User authentication
- Multiple sheets support
- Export/Import functionality
- Search and filter capabilities
- Question status tracking (solved, in-progress, etc.)
- Move sub-topics between topics
- Move questions between sub-topics

## License

ISC
