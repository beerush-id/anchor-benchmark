import { create } from 'zustand';
import { type Post, type Category, type Tag as TagType, type ComplexState } from '@anchor-benchmark/shared';
import RAWJson from './dummyContent.json';

// Add typings to the dummy data.
const dummyContent = RAWJson as unknown as ComplexState;

// Utility function to generate short IDs (similar to Anchor's shortId)
export const shortId = () => Math.random().toString(36).substring(2, 9);

interface ComplexStoreState {
  posts: Post[];
  categories: Category[];
  tags: TagType[];

  // Posts actions
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
  incrementPostViews: (postId: string) => void;
  addPostLike: (postId: string) => void;
  addPostComment: (postId: string, comment: Post['comments'][number]) => void;

  // Comments actions
  addCommentLike: (postId: string, commentId: string) => void;
  addCommentReply: (postId: string, commentId: string, reply: Post['comments'][number]['replies'][number]) => void;

  // Replies actions
  addReplyLike: (postId: string, commentId: string, replyId: string) => void;

  // Categories actions
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;

  // Tags actions
  addTag: (tag: TagType) => void;
  removeTag: (tagId: string) => void;
}

export const useComplexStore = create<ComplexStoreState>()((set) => ({
  posts: structuredClone(dummyContent.posts),
  categories: structuredClone(dummyContent.categories),
  tags: structuredClone(dummyContent.tags),

  // Posts actions
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
  incrementPostViews: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, views: post.views + 1 } : post)),
    })),
  addPostLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, likes: [...post.likes, shortId()] } : post)),
    })),
  addPostComment: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      ),
    })),

  // Comments actions
  addCommentLike: (postId, commentId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: [...comment.likes, shortId()] } : comment
          ),
        };
      }),
    })),
  addCommentReply: (postId, commentId, reply) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment
          ),
        };
      }),
    })),

  // Replies actions
  addReplyLike: (postId, commentId, replyId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;

            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId ? { ...reply, likes: [...reply.likes, shortId()] } : reply
              ),
            };
          }),
        };
      }),
    })),

  // Categories actions
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId),
    })),

  // Tags actions
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (tagId) =>
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== tagId),
    })),
}));
