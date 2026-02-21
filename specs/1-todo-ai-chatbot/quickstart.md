# Quickstart Guide: Todo AI Chatbot

## Prerequisites
- Python 3.11+
- Node.js 18+
- Poetry (for Python dependency management)
- npm/yarn (for frontend dependencies)
- PostgreSQL-compatible database (Neon Serverless recommended)

## Environment Setup

### Backend Setup
```bash
# Clone the repository
git clone <repo-url>
cd <repo-name>

# Navigate to backend
cd backend

# Install Python dependencies
poetry install

# Set up environment variables
cp .env.example .env
# Edit .env with your values:
# COHERE_API_KEY=your_cohere_api_key_here
# DATABASE_URL=your_database_url_here
# BETTER_AUTH_SECRET=your_auth_secret_here
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install JavaScript dependencies
npm install
# OR
yarn install

# Set up environment variables if needed
cp .env.example .env
```

## Running the Application

### Backend
```bash
# Activate virtual environment
poetry shell

# Run database migrations
poetry run alembic upgrade head

# Start the backend server
poetry run uvicorn src.main:app --reload
```

### Frontend
```bash
# Start the frontend development server
npm run dev
# OR
yarn dev
```

## Configuration

### MCP Server Setup
1. Install the MCP server and task tools
2. Configure the MCP tools for task management (add_task, list_tasks, etc.)
3. Ensure the tools connect to the same database as the backend

### Cohere API Integration
1. Obtain a Cohere API key from the Cohere dashboard
2. Add the key to your environment variables as `COHERE_API_KEY`
3. Verify the OpenAI Agents SDK is configured to use Cohere as the model provider

### Better Auth Configuration
1. Set up Better Auth with your domain
2. Configure the auth secret in `BETTER_AUTH_SECRET`
3. Ensure frontend and backend are properly configured for authentication

## Testing the Chatbot

1. Start both backend and frontend servers
2. Navigate to the frontend in your browser
3. Authenticate using the existing Better Auth flow
4. Click the chatbot icon to open the ChatKit interface
5. Interact with the chatbot using natural language commands:
   - "Add task: Buy groceries"
   - "Show my tasks"
   - "Complete task #1"
   - "Update task #2 to 'Buy vegetables'"
   - "Delete task #3"

## Development Commands

### Backend
```bash
# Run tests
poetry run pytest

# Format code
poetry run black src/

# Check types
poetry run mypy src/
```

### Frontend
```bash
# Run tests
npm run test
# OR
yarn test

# Build for production
npm run build
# OR
yarn build
```

## Troubleshooting

- **Cohere API errors**: Verify your API key is correct and has sufficient quota
- **Authentication issues**: Check that your domain is properly configured in Better Auth
- **Database connection errors**: Verify your DATABASE_URL is correct and accessible
- **MCP tools not working**: Ensure the MCP server is running and tools are properly configured