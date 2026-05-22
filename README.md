# Fudyfoods Dashboard 🍹

Professional dashboard for Fudyfoods with autonomous AI agents and real-time analytics.

## 🏗️ Project Structure

```
fudyfoods/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── agents/      # Autogen AI agents
│   │   └── config/      # Configuration
│   ├── main.py          # FastAPI app entry
│   ├── requirements.txt  # Python dependencies
│   └── .env.local       # Environment variables
│
└── frontend/             # Next.js frontend
    ├── app/
    │   ├── components/  # React components
    │   ├── lib/        # Utilities & API clients
    │   ├── dashboard/  # Dashboard pages
    │   ├── page.tsx    # Home page
    │   └── layout.tsx  # Root layout
    ├── styles/         # Global styles
    ├── package.json
    ├── next.config.js
    └── .env.local      # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm or yarn**
- Supabase account (https://supabase.com)
- OpenAI API key (for AI agents)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Configure environment variables in `backend/.env.local`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
uvicorn main:app --reload
```

Backend will run on: `http://localhost:8000`
Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure environment variables in `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📊 Features

### Dashboard
- **Real-time Analytics**: Total sales, products sold, average order value
- **Charts & Graphs**: Sales trends, top products visualization
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Modern, professional UI

### Backend API
- **Products Endpoint**: CRUD operations for products
- **Analytics Endpoint**: Sales data and trends
- **Health Check**: API status monitoring
- **Supabase Integration**: Direct database connection

### AI Agents (Autogen)
- **Sales Analyst**: Analyzes sales data and identifies trends
- **Inventory Manager**: Monitors stock levels and predicts demand
- **Marketing Agent**: Analyzes customer behavior and suggests strategies
- **Multi-Agent Orchestration**: Agents work together autonomously

## 🔌 API Endpoints

### Health
- `GET /health` - API health check
- `GET /` - Root endpoint

### Products
- `GET /products/` - List all products
- `GET /products/{id}` - Get product by ID
- `POST /products/` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Analytics
- `GET /analytics/dashboard` - Get dashboard metrics
- `GET /analytics/sales-trend` - Get sales trend over time

## 🤖 AI Agents

The system uses **Autogen** for multi-agent orchestration:

1. **User Proxy**: Coordinator and executor
2. **Sales Analyst**: Sales insights and reporting
3. **Inventory Manager**: Stock optimization and demand prediction
4. **Marketing Agent**: Pricing strategies and promotions

Agents communicate and collaborate to provide comprehensive business intelligence.

## 📦 Dependencies

### Backend
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Supabase**: Database and auth
- **Autogen**: Multi-agent AI framework
- **Pydantic**: Data validation

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Supabase Client**: Database access

## 🔐 Environment Variables

See `.env.local` template files in both backend and frontend directories.

## 📝 Development Workflow

1. Make changes to code
2. Backend auto-reloads with `uvicorn --reload`
3. Frontend auto-reloads with hot module replacement
4. Check API docs at `http://localhost:8000/docs`
5. Test dashboard at `http://localhost:3000`

## 🚨 Troubleshooting

### Backend won't start
- Ensure Python 3.10+ is installed
- Virtual environment is activated
- All dependencies are installed: `pip install -r requirements.txt`

### Frontend won't start
- Ensure Node.js 18+ is installed
- Install dependencies: `npm install`
- Check that `NEXT_PUBLIC_BACKEND_URL` is set correctly

### Supabase connection issues
- Verify credentials in `.env.local`
- Ensure Supabase project is active
- Check database tables exist in Supabase

### AI Agents not working
- Set `OPENAI_API_KEY` in backend `.env.local`
- Ensure OpenAI account has sufficient credits

## 📚 Documentation

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Autogen Docs](https://microsoft.github.io/autogen/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is proprietary to Fudyfoods.

## 👨‍💻 Author

Developed for Fudyfoods

---

**Happy coding! 🚀**
