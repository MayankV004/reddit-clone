# 🔍 Reddit Clone

A full-featured Reddit clone built with Next.js, TypeScript, Supabase, Prisma, and shadcn/ui components.

## 📋 Features

- **User Authentication** - Sign up, login, and logout functionality using NextAuth
- **Communities** - Create and browse communities (subreddits)
- **Posts** - Create text, image, and link posts within communities
- **Voting System** - Upvote and downvote posts
- **Comments** - Comment on posts and engage in discussions
- **Sorting** - Sort posts by popularity or recency
- **Responsive Design** - Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with TypeScript
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git
- Supabase account for database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MayankV004/reddit-clone.git
   cd reddit-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Next Auth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Next Auth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Supabase
   DATABASE_URL=your_supabase_connection_string
   DIRECT_URL=your_direct_url

   NEXT_PUBLIC_SUPABASE_URL=get_this from_your_supabase_project
   NEXT_PUBLIC_SUPABASE_ANON_KEY=get_this from_your_supabase_project
   SUPABASE_SERVICE_ROLE_KEY=get_this from_your_supabase_project
  
   ```

4. Set up Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Database Schema

The application uses the following data models:

- **User**: Authentication and user profile information
- **Community**: Subreddit-like groups
- **Post**: User submissions within communities
- **Comment**: Responses to posts
- **Vote**: Upvotes/downvotes on posts

## 📱 Key User Flows

1. **Authentication**: Users can sign up, log in, and log out
2. **Creating Communities**: Authenticated users can create new communities
3. **Creating Posts**: Authenticated users can create posts in communities
4. **Voting**: Authenticated users can upvote or downvote posts
5. **Commenting**: Authenticated users can comment on posts
6. **Browsing**: All users can browse communities and posts, sorted by popularity or recency

## 🧩 API Routes

- `/api/auth/[...nextauth]*` - NextAuth authentication endpoints
- `/api/auth/register*` - For registering New user
- `/api/communities` - CRUD operations for communities
- `/api/posts` - CRUD operations for posts
- `/api/comments` - CRUD operations for comments
- `/api/votes` - Endpoints for post voting
- `/api/users/profile` - For profile edit


## 🚢 Deployment

The application can be deployed on Vercel with minimal configuration:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
