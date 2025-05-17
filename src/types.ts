export interface Community {
  id: string;
  name: string;
  slug: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  description: string | null;
  posts?: Post[];
}
export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}
  
 export interface Post {
    id: string;
    title: string;
    content: string | null;
    imageUrl: string | null;
    communityId: string;
    slug: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    community?: {
      id: string;
      name: string;
      slug: string | null;
      imageUrl: string | null;
      description: string | null;
      createdAt: Date;
    };
    user?: {
      id: string;
      username: string;
      image: string | null;
    };
    votes: any[];
    _count?: {
      comments: number;
      votes: number;
    };
}
  
  export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    parentId?: string | null;
    user?: User;
    post?: Post;
    votes: Vote[];
    replies: Comment[]; 
    _count?: {
      votes: number;
      replies: number;
    };
  }
  
  export interface Vote {
    id: string;
    value : number; // 1 or -1
    userId: string;
    postId: string | null;
    commentId?: string | null;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
  }