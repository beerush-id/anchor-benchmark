import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  type Post,
  type Category,
  type Tag as TagType,
  type ComplexState,
  type Author,
  type Comment,
} from '@anchor-benchmark/shared';
import RAWJson from './dummyContent.json';

// Add typings to the dummy data.
const dummyContent = RAWJson as unknown as ComplexState;

// Utility function to generate short IDs (similar to Anchor's shortId)
export const shortId = () => Math.random().toString(36).substring(2, 9);

// Convert complex state types for Redux serialization
interface SerializableAuthor {
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
}

interface SerializableComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string; // ISO string instead of Date object
  updatedAt: string; // ISO string instead of Date object
  likes: string[]; // user IDs who liked the comment
  replies: SerializableComment[]; // nested replies
  author: SerializableAuthor;
}

interface SerializablePost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  excerpt?: string;
  createdAt: string; // ISO string instead of Date object
  updatedAt: string; // ISO string instead of Date object
  publishedAt?: string; // ISO string instead of Date object
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
  likes: string[]; // user IDs who liked the post
  comments: SerializableComment[];
  views: number;
  featuredImage?: string;
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    readingTime: number; // in minutes
    lastEditor: SerializableAuthor;
  };
}

interface SerializableCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // for hierarchical categories
  children: SerializableCategory[]; // nested subcategories
  postCount: number;
}

interface SerializableTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

// Convert Date objects to ISO strings for Redux serialization
const toSerializableAuthor = (author: Author): SerializableAuthor => ({
  ...author,
});

const toSerializableComment = (comment: Comment): SerializableComment => ({
  ...comment,
  createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
  updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
  replies: comment.replies ? comment.replies.map(toSerializableComment) : [],
  author: toSerializableAuthor(comment.author),
});

const toSerializablePost = (post: Post): SerializablePost => ({
  ...post,
  createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
  updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
  publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
  comments: post.comments ? post.comments.map(toSerializableComment) : [],
  metadata: {
    ...post.metadata,
    lastEditor: toSerializableAuthor(post.metadata.lastEditor),
  },
});

const toSerializableCategory = (category: Category): SerializableCategory => ({
  ...category,
  children: category.children ? category.children.map(toSerializableCategory) : [],
});

const toSerializableTag = (tag: TagType): SerializableTag => ({
  ...tag,
});

// Complex state slice
interface ComplexStateSerializable {
  posts: SerializablePost[];
  categories: SerializableCategory[];
  tags: SerializableTag[];
}

const initialComplexState: ComplexStateSerializable = {
  posts: structuredClone(dummyContent.posts).map(toSerializablePost),
  categories: structuredClone(dummyContent.categories).map(toSerializableCategory),
  tags: structuredClone(dummyContent.tags).map(toSerializableTag),
};

const complexSlice = createSlice({
  name: 'complex',
  initialState: initialComplexState,
  reducers: {
    // Posts actions
    addPost: (state, action: PayloadAction<SerializablePost>) => {
      state.posts.push(action.payload);
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.posts.splice(action.payload, 1);
    },
    incrementPostViews: (state, action: PayloadAction<number>) => {
      const post = state.posts[action.payload];
      if (post) {
        post.views++;
      }
    },
    addPostLike: (state, action: PayloadAction<number>) => {
      const post = state.posts[action.payload];
      if (post) {
        post.likes.push(shortId());
      }
    },
    addPostComment: (state, action: PayloadAction<{ index: number; comment: SerializableComment }>) => {
      const post = state.posts[action.payload.index];
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },

    // Comments actions
    addCommentLike: (state, action: PayloadAction<{ postIndex: number; commentIndex: number }>) => {
      const post = state.posts[action.payload.postIndex];
      if (post) {
        const comment = post.comments[action.payload.commentIndex];
        if (comment) {
          comment.likes.push(shortId());
        }
      }
    },
    addCommentReply: (
      state,
      action: PayloadAction<{ postIndex: number; commentIndex: number; reply: SerializableComment }>
    ) => {
      const post = state.posts[action.payload.postIndex];
      if (post) {
        const comment = post.comments[action.payload.commentIndex];
        if (comment) {
          comment.replies.push(action.payload.reply);
        }
      }
    },

    // Replies actions
    addReplyLike: (state, action: PayloadAction<{ postIndex: number; commentIndex: number; replyIndex: number }>) => {
      const post = state.posts[action.payload.postIndex];
      if (post) {
        const comment = post.comments[action.payload.commentIndex];
        if (comment) {
          const reply = comment.replies[action.payload.replyIndex];
          if (reply) {
            reply.likes.push(shortId());
          }
        }
      }
    },

    // Categories actions
    addCategory: (state, action: PayloadAction<SerializableCategory>) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      state.categories.splice(action.payload, 1);
    },

    // Tags actions
    addTag: (state, action: PayloadAction<SerializableTag>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<number>) => {
      state.tags.splice(action.payload, 1);
    },
  },
});

export const {
  addPost,
  removePost,
  incrementPostViews,
  addPostLike,
  addPostComment,
  addCommentLike,
  addCommentReply,
  addReplyLike,
  addCategory,
  removeCategory,
  addTag,
  removeTag,
} = complexSlice.actions;

export const complexReducer = complexSlice.reducer;
