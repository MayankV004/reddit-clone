export interface Community {
  id: string;
  name: string;
  slug: string | null;
  createdAt: Date;
  imageUrl?: string;
  description?: string;
}
export interface User {
  id: string;
  username: string;
}
  
 export interface Post {
  id: string;
  title: string;
  content: string | null;
  imageUrl?: string | null;
  communityId: string;
  slug: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  community?: Community;
  user?: User;
  votes: Vote[];
  _count?: {
    comments: number;
    votes: number;
  };
}
  
  export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
    author?: User;
  }
  
  export interface Vote {
    id: string;
    value : number; // 1 or -1
    userId: string;
    postId: string | null;
    commentId?: string | null;
  }