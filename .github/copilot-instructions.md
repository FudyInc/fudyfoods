# Fudyfoods Dashboard - Development Instructions

## Project Overview
Professional dashboard for Fudyfoods with:
- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: FastAPI with Python
- **AI Agents**: Autogen for autonomous multi-agent systems
- **Database**: Supabase PostgreSQL
- **Architecture**: Microservices-ready, scalable

## Development Setup

### Backend (FastAPI)
- Location: `/backend`
- Python 3.10+
- Virtual environment: `backend/venv`
- Package manager: pip
- Key packages: FastAPI, Uvicorn, Supabase, Autogen, Pydantic

### Frontend (Next.js)
- Location: `/frontend`
- Node.js 18+
- Package manager: npm/yarn
- Key packages: React 18, TypeScript, Tailwind CSS, Shadcn/ui, Supabase client

### Database
- Supabase PostgreSQL connection
- Environment: `.env.local` files in both frontend and backend

### AI Agents
- Framework: Autogen
- Multi-agent orchestration for autonomous tasks
- Located in `/backend/agents`

## Key Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create `.env.local` files:

**Backend** (`backend/.env.local`):
```
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Current Progress
- [ ] Backend structure created
- [ ] Frontend structure created
- [ ] Supabase integration
- [ ] Autogen agents setup
- [ ] Dashboard components
- [ ] API endpoints
