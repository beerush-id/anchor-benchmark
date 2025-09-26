import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category, ComplexState, Post, Tag } from '@anchor-benchmark/shared';
import dummyData from '@anchor-benchmark/shared/data/dummy-data.json';

// Add typings to the dummy data
const dummyContent = dummyData as unknown as ComplexState;

// Create a deep clone of the initial state
const initialState: ComplexState = structuredClone(dummyContent) as ComplexState;

const complexSlice = createSlice({
  name: 'complex',
  initialState,
  reducers: {
    // Posts actions
    addPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts.push(...action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const index = state.posts.findIndex((post) => post.id === action.payload);
      if (index !== -1) {
        state.posts.splice(index, 1);
      }
    },
    incrementPostViews: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.views += 1;
      }
    },
    addPostLike: (state, action: PayloadAction<{ postId: string; likeId: string }>) => {
      const post = state.posts.find((post) => post.id === action.payload.postId);
      if (post) {
        post.likes.push(action.payload.likeId);
      }
    },
    addPostComment: (state, action: PayloadAction<{ postId: string; comment: Post['comments'][number] }>) => {
      const post = state.posts.find((post) => post.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },

    // Categories actions
    addCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories.push(...action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const index = state.categories.findIndex((category) => category.id === action.payload);
      if (index !== -1) {
        state.categories.splice(index, 1);
      }
    },

    // Tags actions
    addTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags.push(...action.payload);
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      const index = state.tags.findIndex((tag) => tag.id === action.payload);
      if (index !== -1) {
        state.tags.splice(index, 1);
      }
    },

    // Comment actions
    addCommentLike: (state, action: PayloadAction<{ postId: string; commentId: string; likeId: string }>) => {
      const post = state.posts.find((post) => post.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find((comment) => comment.id === action.payload.commentId);
        if (comment) {
          comment.likes.push(action.payload.likeId);
        }
      }
    },
    addCommentReply: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; reply: Post['comments'][number]['replies'][number] }>
    ) => {
      const post = state.posts.find((post) => post.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find((comment) => comment.id === action.payload.commentId);
        if (comment) {
          comment.replies.push(action.payload.reply);
        }
      }
    },

    // Reply actions
    addReplyLike: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; replyId: string; likeId: string }>
    ) => {
      const post = state.posts.find((post) => post.id === action.payload.postId);
      if (post) {
        const comment = post.comments.find((comment) => comment.id === action.payload.commentId);
        if (comment) {
          const reply = comment.replies.find((reply) => reply.id === action.payload.replyId);
          if (reply) {
            reply.likes.push(action.payload.likeId);
          }
        }
      }
    },
  },
});

export const {
  addPosts,
  deletePost,
  incrementPostViews,
  addPostLike,
  addPostComment,
  addCategories,
  deleteCategory,
  addTags,
  deleteTag,
  addCommentLike,
  addCommentReply,
  addReplyLike,
} = complexSlice.actions;

export const complexReducer = complexSlice.reducer;
