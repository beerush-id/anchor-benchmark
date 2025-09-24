export type Author = {
  id: string;
  username: string;
  avatar: string;
  reputation: number;
  badges: string[];
  location: {
    city: string;
    country: string;
    timezone: string;
  };
  social: {
    twitter: string;
    github: string;
  };
};

export type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[]; // user IDs who liked the comment
  replies: Comment[]; // nested replies
  author: Author;
};

export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
  likes: string[]; // user IDs who liked the post
  comments: Comment[];
  views: number;
  featuredImage?: string;
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    readingTime: number; // in minutes
    lastEditor: Author;
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // for hierarchical categories
  children: Category[]; // nested subcategories
  postCount: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  relatedEntityId?: string; // ID of the entity related to this notification
  relatedEntityType?: 'post' | 'comment' | 'user';
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
};

export type AnalyticsData = {
  daily: {
    date: Date;
    visitors: number;
    pageViews: number;
    uniqueVisitors: number;
  }[];
  bySource: {
    source: string;
    visitors: number;
    pageViews: number;
  }[];
  byContent: {
    postId: string;
    views: number;
    engagement: number; // likes + comments
  }[];
};

export type ComplexState = {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  analytics: AnalyticsData;
  ui: {
    sidebar: {
      collapsed: boolean;
      activeItem: string;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
};
