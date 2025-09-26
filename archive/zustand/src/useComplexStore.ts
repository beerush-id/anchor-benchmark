import { create } from 'zustand';
import { type Category, type ComplexState, type Post, type Tag as TagType } from '@anchor-benchmark/shared';
import dummyData from '@anchor-benchmark/shared/data/dummy-data.json';

// Add typings to the dummy data.
const dummyContent = dummyData as unknown as ComplexState;

// Create initial state
const initialState: ComplexState = structuredClone(dummyContent) as ComplexState;

interface ComplexStoreState extends ComplexState {
  // Posts actions
  addPosts: (posts: Post[]) => void;
  deletePost: (postId: string) => void;
  incrementPostViews: (postId: string) => void;
  addPostLike: (postId: string, likeId: string) => void;
  addPostComment: (postId: string, comment: Post['comments'][number]) => void;

  // Categories actions
  addCategories: (categories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;

  // Tags actions
  addTags: (tags: TagType[]) => void;
  deleteTag: (tagId: string) => void;

  // Comment actions
  addCommentLike: (postId: string, commentId: string, likeId: string) => void;
  addCommentReply: (postId: string, commentId: string, reply: Post['comments'][number]['replies'][number]) => void;

  // Reply actions
  addReplyLike: (postId: string, commentId: string, replyId: string, likeId: string) => void;
}

export const useComplexStore = create<ComplexStoreState>()((set) => ({
  ...initialState,

  // Posts actions
  addPosts: (posts: Post[]) => {
    set((state) => ({
      posts: [...state.posts, ...posts],
    }));
  },

  deletePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },

  incrementPostViews: (postId: string) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        views: updatedPosts[postIndex].views + 1,
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },

  addPostLike: (postId: string, likeId: string) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        likes: [...updatedPosts[postIndex].likes, likeId],
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },

  addPostComment: (postId: string, comment: Post['comments'][number]) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        comments: [...updatedPosts[postIndex].comments, comment],
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },

  // Categories actions
  addCategories: (categories: Category[]) => {
    set((state) => ({
      categories: [...state.categories, ...categories],
    }));
  },

  deleteCategory: (categoryId: string) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId),
    }));
  },

  // Tags actions
  addTags: (tags: TagType[]) => {
    set((state) => ({
      tags: [...state.tags, ...tags],
    }));
  },

  deleteTag: (tagId: string) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== tagId),
    }));
  },

  // Comment actions
  addCommentLike: (postId: string, commentId: string, likeId: string) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const commentIndex = state.posts[postIndex].comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        comments: [...updatedPosts[postIndex].comments],
      };

      updatedPosts[postIndex].comments[commentIndex] = {
        ...updatedPosts[postIndex].comments[commentIndex],
        likes: [...updatedPosts[postIndex].comments[commentIndex].likes, likeId],
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },

  addCommentReply: (postId: string, commentId: string, reply: Post['comments'][number]['replies'][number]) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const commentIndex = state.posts[postIndex].comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        comments: [...updatedPosts[postIndex].comments],
      };

      updatedPosts[postIndex].comments[commentIndex] = {
        ...updatedPosts[postIndex].comments[commentIndex],
        replies: [...updatedPosts[postIndex].comments[commentIndex].replies, reply],
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },

  // Reply actions
  addReplyLike: (postId: string, commentId: string, replyId: string, likeId: string) => {
    set((state) => {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) return state;

      const commentIndex = state.posts[postIndex].comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) return state;

      const replyIndex = state.posts[postIndex].comments[commentIndex].replies.findIndex(
        (reply) => reply.id === replyId
      );
      if (replyIndex === -1) return state;

      const updatedPosts = [...state.posts];
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        comments: [...updatedPosts[postIndex].comments],
      };

      updatedPosts[postIndex].comments[commentIndex] = {
        ...updatedPosts[postIndex].comments[commentIndex],
        replies: [...updatedPosts[postIndex].comments[commentIndex].replies],
      };

      updatedPosts[postIndex].comments[commentIndex].replies[replyIndex] = {
        ...updatedPosts[postIndex].comments[commentIndex].replies[replyIndex],
        likes: [...updatedPosts[postIndex].comments[commentIndex].replies[replyIndex].likes, likeId],
      };

      return {
        ...state,
        posts: updatedPosts,
      };
    });
  },
}));

// Selectors with proper memoization to avoid infinite loops
export const selectPosts = (state: ComplexStoreState) => state.posts;
export const selectCategories = (state: ComplexStoreState) => state.categories;
export const selectTags = (state: ComplexStoreState) => state.tags;

// Post selectors
export const selectPostViews = (postId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  return post ? post.views : 0;
};

export const selectPostLikesCount = (postId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  return post ? post.likes.length : 0;
};

export const selectPostCommentsCount = (postId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  return post ? post.comments.length : 0;
};

export const selectPostStatus = (postId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  return post ? post.status : '';
};

export const selectPostComments = (postId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  return post ? post.comments : [];
};

// Comment selectors
export const selectCommentLikesCount = (postId: string, commentId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  const comment = post?.comments.find((comment) => comment.id === commentId);
  return comment ? comment.likes.length : 0;
};

export const selectCommentRepliesCount = (postId: string, commentId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  const comment = post?.comments.find((comment) => comment.id === commentId);
  return comment ? comment.replies.length : 0;
};

export const selectCommentReplies = (postId: string, commentId: string) => (state: ComplexStoreState) => {
  const post = state.posts.find((post) => post.id === postId);
  const comment = post?.comments.find((comment) => comment.id === commentId);
  return comment ? comment.replies : [];
};

// Reply selectors
export const selectReplyLikesCount =
  (postId: string, commentId: string, replyId: string) => (state: ComplexStoreState) => {
    const post = state.posts.find((post) => post.id === postId);
    const comment = post?.comments.find((comment) => comment.id === commentId);
    const reply = comment?.replies.find((reply) => reply.id === replyId);
    return reply ? reply.likes.length : 0;
  };

// Stats selectors
export const selectPostsCount = (state: ComplexStoreState) => state.posts.length;
export const selectCategoriesCount = (state: ComplexStoreState) => state.categories.length;
export const selectTagsCount = (state: ComplexStoreState) => state.tags.length;
