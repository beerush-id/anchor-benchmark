import { BarChart2, Calendar, Eye, Folder, Hash, Heart, MessageSquare, Reply, Tag, Trash2, User } from 'lucide-react';
import {
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  type Category,
  type ComplexState,
  evaluate,
  type Post,
  shortId,
  type Tag as TagType,
} from '@anchor-benchmark/shared';
import { memo, useEffect, useReducer, useRef } from 'react';
import dummyData from '@anchor-benchmark/shared/data/dummy-data.json';

// Add typings to the dummy data.
const dummyContent = dummyData as unknown as ComplexState;

// Create a deep clone of the initial state
const initialState: ComplexState = structuredClone(dummyContent) as ComplexState;

// Action types for our reducers
type ComplexAction =
  // Posts actions
  | { type: 'ADD_POSTS'; payload: Post[] }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'INCREMENT_POST_VIEWS'; payload: string }
  | { type: 'ADD_POST_LIKE'; payload: { postId: string; likeId: string } }
  | { type: 'ADD_POST_COMMENT'; payload: { postId: string; comment: Post['comments'][number] } }
  // Categories actions
  | { type: 'ADD_CATEGORIES'; payload: Category[] }
  | { type: 'DELETE_CATEGORY'; payload: string }
  // Tags actions
  | { type: 'ADD_TAGS'; payload: TagType[] }
  | { type: 'DELETE_TAG'; payload: string }
  // Comment actions
  | { type: 'ADD_COMMENT_LIKE'; payload: { postId: string; commentId: string; likeId: string } }
  | {
      type: 'ADD_COMMENT_REPLY';
      payload: { postId: string; commentId: string; reply: Post['comments'][number]['replies'][number] };
    }
  // Reply actions
  | { type: 'ADD_REPLY_LIKE'; payload: { postId: string; commentId: string; replyId: string; likeId: string } };

// Reducer for complex state
const complexReducer = (state: ComplexState, action: ComplexAction): ComplexState => {
  switch (action.type) {
    // Posts actions
    case 'ADD_POSTS':
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
      };

    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    case 'INCREMENT_POST_VIEWS': {
      return {
        ...state,
        posts: state.posts.map((post) => (post.id === action.payload ? { ...post, views: post.views + 1 } : post)),
      };
    }

    case 'ADD_POST_LIKE': {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId ? { ...post, likes: [...post.likes, action.payload.likeId] } : post
        ),
      };
    }

    case 'ADD_POST_COMMENT': {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId ? { ...post, comments: [...post.comments, action.payload.comment] } : post
        ),
      };
    }

    // Categories actions
    case 'ADD_CATEGORIES':
      return {
        ...state,
        categories: [...state.categories, ...action.payload],
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };

    // Tags actions
    case 'ADD_TAGS':
      return {
        ...state,
        tags: [...state.tags, ...action.payload],
      };

    case 'DELETE_TAG':
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
      };

    // Comment actions
    case 'ADD_COMMENT_LIKE': {
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;

          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== action.payload.commentId) return comment;

              return {
                ...comment,
                likes: [...comment.likes, action.payload.likeId],
              };
            }),
          };
        }),
      };
    }

    case 'ADD_COMMENT_REPLY': {
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;

          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== action.payload.commentId) return comment;

              return {
                ...comment,
                replies: [...comment.replies, action.payload.reply],
              };
            }),
          };
        }),
      };
    }

    // Reply actions
    case 'ADD_REPLY_LIKE': {
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id !== action.payload.postId) return post;

          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id !== action.payload.commentId) return comment;

              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id !== action.payload.replyId) return reply;

                  return {
                    ...reply,
                    likes: [...reply.likes, action.payload.likeId],
                  };
                }),
              };
            }),
          };
        }),
      };
    }

    default:
      return state;
  }
};

// Debug render function to visualize re-renders
const useDebugRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  useEffect(() => {
    if (ref.current) {
      // Check if this is the first render or a re-render
      if (!ref.current.hasAttribute('data-rendered')) {
        // First render - red box shadow
        ref.current.setAttribute('data-rendered', 'true');
        ref.current.style.boxShadow = '0 0 0 1px red';
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.boxShadow = 'none';
          }
        }, 300);
      } else {
        // Re-render - blue box shadow
        ref.current.style.boxShadow = '0 0 0 1px blue';
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.boxShadow = 'none';
          }
        }, 300);
      }
    }
  });
};

const benchmark = (fn: () => void) => {
  return evaluate(fn, BENCHMARK_SIZE);
};

const toggleBenchmark = (fn: () => void) => {
  return evaluate(fn, BENCHMARK_TOGGLE_SIZE);
};

export default function Complex() {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const [state, dispatch] = useReducer(complexReducer, initialState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7">
            <PostsSection state={state} dispatch={dispatch} />
          </div>
          <div className="lg:col-span-3">
            <CategoriesAndTagsSection state={state} dispatch={dispatch} />
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-xs">
          <p className="text-gray-500 text-sm text-center px-10 py-6">
            This benchmark demonstrates complex nested state management with Native React.
          </p>
        </div>
      </div>
    </div>
  );
}

const PostsSection = ({ state, dispatch }: { state: ComplexState; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const addPosts = () => {
    benchmark(() => {
      const newPosts = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.posts[0]),
        id: shortId(),
      }));
      dispatch({ type: 'ADD_POSTS', payload: newPosts });
    });
  };

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-xs p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart2 className="text-blue-600" size={24} />
        </div>
        <h2 className="font-semibold text-gray-800 text-xl">Posts</h2>
        <span className="flex-1"></span>
        <button
          onClick={addPosts}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
          <BarChart2 size={16} />
          Add {BENCHMARK_SIZE.toLocaleString()} Posts
        </button>
      </div>
      <PostList state={state} dispatch={dispatch} />
    </div>
  );
};

const PostList = ({ state, dispatch }: { state: ComplexState; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const posts = state.posts;

  if (!posts.length) {
    return <p className="text-gray-500 text-center py-4">No posts yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {posts.map((post) => (
        <PostItem key={post.id} item={post} dispatch={dispatch} />
      ))}
    </ul>
  );
};

const PostItem = memo(({ item, dispatch }: { item: Post; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const incrementViews = () => {
    dispatch({ type: 'INCREMENT_POST_VIEWS', payload: item.id });
  };

  const addLike = () => {
    dispatch({ type: 'ADD_POST_LIKE', payload: { postId: item.id, likeId: shortId() } });
  };

  const addComment = () => {
    dispatch({
      type: 'ADD_POST_COMMENT',
      payload: {
        postId: item.id,
        comment: { ...structuredClone(dummyContent.posts[0].comments[0]), id: shortId() },
      },
    });
  };

  const deletePost = () => {
    dispatch({ type: 'DELETE_POST', payload: item.id });
  };

  const PostStats = () => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    return (
      <div ref={ref} className="flex flex-wrap gap-2 mb-3">
        <span className="font-medium text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
          <Eye size={14} /> {item.views.toLocaleString()}
        </span>
        <span className="font-medium text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-1">
          <Heart size={14} /> {item.likes.length.toLocaleString()}
        </span>
        <span className="font-medium text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
          <MessageSquare size={14} /> {item.comments.length.toLocaleString()}
        </span>
        <span className="font-medium text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{item.status}</span>
      </div>
    );
  };

  const PostInfo = () => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    return (
      <div ref={ref} className="flex flex-col bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-xl mb-2">{item.title}</h3>
            <PostStats />
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <User size={14} /> {item.metadata.lastEditor.username}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Hash size={14} /> {item.tags.length} tags
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-gray-700">{item.content.substring(0, 300)}...</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const PostComments = () => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const displayedComments = item.comments.slice(0, 5);

    return (
      <>
        {displayedComments.length > 0 && (
          <div ref={ref} className="mt-4 ml-2 pl-4 border-l-2 border-gray-200 flex flex-col gap-3">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <MessageSquare size={16} />
              Comments ({item.comments.length.toLocaleString()})
            </h4>
            {displayedComments.map(
              (comment, index) =>
                index < 5 && <CommentItem key={comment.id} comment={comment} postId={item.id} dispatch={dispatch} />
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <li ref={ref} className="mb-6 last:mb-0">
      <PostInfo />
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => toggleBenchmark(incrementViews)}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1">
          <Eye size={16} />
          View ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
        <button
          onClick={() => toggleBenchmark(addLike)}
          className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
          <Heart size={16} />
          Like ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
        <button
          onClick={() => toggleBenchmark(addComment)}
          className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1">
          <MessageSquare size={16} />
          Comment ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
        <button
          onClick={deletePost}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
          <Trash2 size={16} />
        </button>
      </div>
      <PostComments />
    </li>
  );
});

const CommentItem = memo(
  ({
    comment,
    postId,
    dispatch,
  }: {
    comment: Post['comments'][number];
    postId: string;
    dispatch: React.Dispatch<ComplexAction>;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const addLike = () => {
      dispatch({ type: 'ADD_COMMENT_LIKE', payload: { postId, commentId: comment.id, likeId: shortId() } });
    };

    const addReply = () => {
      dispatch({
        type: 'ADD_COMMENT_REPLY',
        payload: {
          postId,
          commentId: comment.id,
          reply: { ...structuredClone(dummyContent.posts[0].comments[0]), id: shortId() },
        },
      });
    };

    const deleteComment = () => {
      console.log('Delete comment', comment.id);
    };

    const CommentStats = () => {
      const ref = useRef<HTMLDivElement>(null);
      useDebugRender(ref);

      return (
        <div ref={ref} className="flex gap-4 items-center">
          <button onClick={() => toggleBenchmark(addLike)} className="flex items-center gap-1 hover:text-red-500">
            <span className="flex items-center gap-1 bg-slate-200 rounded-sm px-1 py-0.5 font-medium text-xs">
              <Heart size={14} />
              <span>{comment.likes.length.toLocaleString()}</span>
            </span>
            <span className="font-medium">Like ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)</span>
          </button>
          <button onClick={() => toggleBenchmark(addReply)} className="flex items-center gap-1 hover:text-blue-500">
            <span className="flex items-center gap-1 bg-slate-200 rounded-sm px-1 py-0.5 font-medium text-xs">
              <Reply size={14} />
              <span>{comment.replies.length.toLocaleString()}</span>
            </span>
            <span className="font-medium">Reply ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)</span>
          </button>
        </div>
      );
    };

    const CommentReplies = () => {
      const ref = useRef<HTMLDivElement>(null);
      useDebugRender(ref);

      const replies = comment.replies.slice(0, 3);

      return (
        <>
          {replies.length > 0 && (
            <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-300">
              <h5 className="text-xs font-semibold text-gray-600 mb-2">Replies ({replies.length.toLocaleString()})</h5>
              <div className="space-y-3">
                {replies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} postId={postId} commentId={comment.id} dispatch={dispatch} />
                ))}
              </div>
            </div>
          )}
        </>
      );
    };

    return (
      <div ref={ref} className="bg-gray-100 p-3 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800 text-sm">{comment.author.username}</span>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <CommentStats />
              <button onClick={deleteComment} className="flex items-center gap-1 hover:text-gray-800">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        <CommentReplies />
      </div>
    );
  }
);

const ReplyItem = memo(
  ({
    reply,
    postId,
    commentId,
    dispatch,
  }: {
    reply: Post['comments'][number]['replies'][number];
    postId: string;
    commentId: string;
    dispatch: React.Dispatch<ComplexAction>;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const addLike = () => {
      dispatch({
        type: 'ADD_REPLY_LIKE',
        payload: { postId, commentId, replyId: reply.id, likeId: shortId() },
      });
    };

    const deleteReply = () => {
      console.log('Delete reply', reply.id);
    };

    const LikesCount = () => {
      const ref = useRef<HTMLButtonElement>(null);
      useDebugRender(ref);

      return (
        <button
          ref={ref}
          onClick={() => toggleBenchmark(addLike)}
          className="flex items-center gap-1 hover:text-red-500">
          <Heart size={12} />
          {reply.likes.length.toLocaleString()} ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
      );
    };

    return (
      <div ref={ref} className="bg-gray-200 p-2 rounded">
        <div className="flex items-start gap-2">
          <div className="bg-gray-300 border border-dashed rounded-xl w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800 text-xs">{reply.author.username}</span>
              <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-xs mb-1">{reply.content}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <LikesCount />
              <button onClick={deleteReply} className="flex items-center gap-1 hover:text-gray-800">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const ComplexStats = ({ state }: { state: ComplexState }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const postsCount = state.posts.length;
  const categoriesCount = state.categories.length;
  const tagsCount = state.tags.length;

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-between">
      <div className="flex flex-col items-center mb-4 sm:mb-0">
        <span className="text-2xl font-bold text-gray-800">{postsCount.toLocaleString()}</span>
        <span className="text-sm text-gray-600">Posts</span>
      </div>
      <div className="flex flex-col items-center mb-4 sm:mb-0">
        <span className="text-2xl font-bold text-blue-600">{categoriesCount.toLocaleString()}</span>
        <span className="text-sm text-gray-600">Categories</span>
      </div>
      <div className="flex flex-col items-center mb-4 sm:mb-0">
        <span className="text-2xl font-bold text-yellow-600">{tagsCount.toLocaleString()}</span>
        <span className="text-sm text-gray-600">Tags</span>
      </div>
    </div>
  );
};

const CategoriesAndTagsSection = ({
  state,
  dispatch,
}: {
  state: ComplexState;
  dispatch: React.Dispatch<ComplexAction>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const addCategories = () => {
    benchmark(() => {
      const newCategories = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.categories[0]),
        id: shortId(),
      }));
      dispatch({ type: 'ADD_CATEGORIES', payload: newCategories });
    });
  };

  const addTags = () => {
    benchmark(() => {
      const newTags = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.tags[0]),
        id: shortId(),
      }));
      dispatch({ type: 'ADD_TAGS', payload: newTags });
    });
  };

  return (
    <div ref={ref} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xs p-6">
        <ComplexStats state={state} />
      </div>

      <div className="bg-white rounded-2xl shadow-xs p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Folder className="text-purple-600" size={24} />
          </div>
          <h2 className="font-semibold text-gray-800 text-xl">Categories</h2>
        </div>
        <div className="mb-4">
          <button
            onClick={addCategories}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
            <BarChart2 size={16} />
            Benchmark {BENCHMARK_SIZE.toLocaleString()} Categories
          </button>
        </div>
        <div className="max-h-[512px] overflow-y-auto pr-2">
          <CategoryList state={state} dispatch={dispatch} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Tag className="text-yellow-600" size={24} />
          </div>
          <h2 className="font-semibold text-gray-800 text-xl">Tags</h2>
        </div>
        <div className="mb-4">
          <button
            onClick={addTags}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
            <BarChart2 size={16} />
            Benchmark {BENCHMARK_SIZE.toLocaleString()} Tags
          </button>
        </div>
        <div className="max-h-[512px] overflow-y-auto pr-2">
          <TagList state={state} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
};

const CategoryList = ({ state, dispatch }: { state: ComplexState; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const categories = state.categories;

  if (!categories.length) {
    return <p className="text-gray-500 text-center py-4">No categories yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} item={category} dispatch={dispatch} />
      ))}
    </ul>
  );
};

const CategoryItem = memo(({ item, dispatch }: { item: Category; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const deleteCategory = () => {
    dispatch({ type: 'DELETE_CATEGORY', payload: item.id });
  };

  return (
    <li ref={ref} className="flex items-center justify-between gap-3 bg-gray-50 p-4 rounded-lg mb-3 last:mb-0">
      <div>
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Posts: {item.postCount.toLocaleString()}
          </span>
          {item.children && item.children.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Sub: {item.children.length.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={deleteCategory}
        className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
        <Trash2 size={16} />
      </button>
    </li>
  );
});

const TagList = ({ state, dispatch }: { state: ComplexState; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const tags = state.tags;

  if (!tags.length) {
    return <p className="text-gray-500 text-center py-4">No tags yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {tags.map((tag) => (
        <TagItem key={tag.id} item={tag} dispatch={dispatch} />
      ))}
    </ul>
  );
};

const TagItem = memo(({ item, dispatch }: { item: TagType; dispatch: React.Dispatch<ComplexAction> }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const deleteTag = () => {
    dispatch({ type: 'DELETE_TAG', payload: item.id });
  };

  return (
    <li ref={ref} className="flex items-center justify-between gap-3 bg-gray-50 p-4 rounded-lg mb-3 last:mb-0">
      <div>
        <h3 className="font-semibold text-gray-800">#{item.name}</h3>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Posts: {item.postCount.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        onClick={deleteTag}
        className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
        <Trash2 size={16} />
      </button>
    </li>
  );
});
