# AI Blog Generator

A modern web application built with Next.js 13+ that allows users to generate and manage blog posts using AI assistance.

## Features

- 🤖 AI-powered blog post generation using OpenAI GPT
- 📝 Create, edit, and manage blog posts
- 🔒 Secure authentication with Supabase
- 💾 Redis caching for improved performance
- 📱 Responsive modern UI with Shadcn/UI
- 🔄 Server-side pagination
- ⚡ Real-time updates and background processing
- 🎯 Post limit management (50 posts per user)

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Caching**: Redis (Upstash)
- **AI**: OpenAI GPT API
- **Authentication**: Supabase Auth
- **UI**: Shadcn/UI, Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nhoque101/AI-Blog-Gen-Polished.git
cd AI-Blog-Gen-Polished
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail

### Blog Generation
- AI-powered blog content generation
- Title suggestions based on topics
- Background processing for multiple posts
- Markdown formatting support

### Post Management
- Create, edit, and delete posts
- Draft and published states
- Server-side pagination (6 posts per page)
- Cache invalidation on updates

### Performance
- Redis caching for frequently accessed data
- Optimized database queries
- Background processing for multiple posts
- Efficient cache invalidation

### Security
- Secure authentication with Supabase
- Environment variable protection
- Post limit enforcement
- User data isolation

## License

This project is licensed under the MIT License. 