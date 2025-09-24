import { Eye, MessageSquare, Heart, Trash2, BarChart2, Folder, Tag, User, Calendar, Hash, Reply } from 'lucide-react';
import {
  BENCHMARK_DEBOUNCE_TIME,
  BENCHMARK_SIZE,
  BENCHMARK_TOGGLE_SIZE,
  type Post,
  type Category,
  type Tag as TagType,
  type ComplexState,
} from '@anchor-benchmark/shared';
import { memo, useEffect, useRef, useState } from 'react';
import RAWJson from './dummyContent.json';

// Add typings to the dummy data.
const dummyContent = RAWJson as unknown as ComplexState;

// Utility function to generate short IDs (similar to Anchor's shortId)
const shortId = () => Math.random().toString(36).substring(2, 9);

// Debug render function to visualize re-renders
const debugRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  if (ref.current) {
    // Check if this is the first render or a re-render
    if (!ref.current.hasAttribute('data-rendered')) {
      // First render - red box shadow
      ref.current.setAttribute('data-rendered', 'true');
      ref.current.style.boxShadow = '0 0 0 2px red';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.boxShadow = 'none';
        }
      }, 300);
    } else {
      // Re-render - blue box shadow
      ref.current.style.boxShadow = '0 0 0 2px blue';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.boxShadow = 'none';
        }
      }, 300);
    }
  }
};

// Benchmark functions
const useBenchmark = () => {
  const benchmark = (fn: () => void) => {
    const start = performance.now();
    let count = 0;

    const executeNext = () => {
      if (count < BENCHMARK_SIZE) {
        fn();
        count++;
        setTimeout(executeNext, BENCHMARK_DEBOUNCE_TIME);
      } else {
        const end = performance.now();
        console.log(`Profiling done in ${end - start}ms.`);
      }
    };

    executeNext();
  };

  const toggleBenchmark = (fn: () => void) => {
    const start = performance.now();
    let count = 0;

    const executeNext = () => {
      if (count < BENCHMARK_TOGGLE_SIZE) {
        fn();
        count++;
        setTimeout(executeNext, BENCHMARK_DEBOUNCE_TIME);
      } else {
        const end = performance.now();
        console.log(`Toggle profiling done in ${end - start}ms.`);
      }
    };

    executeNext();
  };

  return { benchmark, toggleBenchmark };
};

export default function Complex() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ComplexState>(structuredClone(dummyContent) as ComplexState);

  useEffect(() => {
    debugRender(ref);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7">
            <PostsSection state={state} setState={setState} />
          </div>
          <div className="lg:col-span-3">
            <CategoriesAndTagsSection state={state} setState={setState} />
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

const PostsSection = ({
  state,
  setState,
}: {
  state: ComplexState;
  setState: React.Dispatch<React.SetStateAction<ComplexState>>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { benchmark } = useBenchmark();

  useEffect(() => {
    debugRender(ref);
  });

  const addPosts = () => {
    benchmark(() => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        newPosts.push(structuredClone({ ...dummyContent.posts[0], id: shortId() }));
        return { ...prev, posts: newPosts };
      });
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
      <PostList state={state} setState={setState} />
    </div>
  );
};

const PostList = ({
  state,
  setState,
}: {
  state: ComplexState;
  setState: React.Dispatch<React.SetStateAction<ComplexState>>;
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    debugRender(ref);
  });

  if (!state.posts.length) {
    return <p className="text-gray-500 text-center py-4">No posts yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {state.posts.map((post) => (
        <PostItem key={post.id} item={post} state={state} setState={setState} />
      ))}
    </ul>
  );
};

const PostItem = memo(
  ({
    item,
    state,
    setState,
  }: {
    item: Post;
    state: ComplexState;
    setState: React.Dispatch<React.SetStateAction<ComplexState>>;
  }) => {
    const ref = useRef<HTMLLIElement>(null);
    const { toggleBenchmark } = useBenchmark();

    useEffect(() => {
      debugRender(ref);
    });

    const incrementViews = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const index = newPosts.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          newPosts[index] = { ...newPosts[index], views: newPosts[index].views + 1 };
        }
        return { ...prev, posts: newPosts };
      });
    };

    const addLike = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const postIndex = newPosts.findIndex((p) => p.id === item.id);
        if (postIndex !== -1) {
          const newLikes = [...newPosts[postIndex].likes, shortId()];
          newPosts[postIndex] = { ...newPosts[postIndex], likes: newLikes };
        }
        return { ...prev, posts: newPosts };
      });
    };

    const addComment = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const postIndex = newPosts.findIndex((p) => p.id === item.id);
        if (postIndex !== -1) {
          const newComments = [
            ...newPosts[postIndex].comments,
            {
              ...structuredClone(dummyContent.posts[0].comments[0]),
              id: shortId(),
            },
          ];
          newPosts[postIndex] = { ...newPosts[postIndex], comments: newComments };
        }
        return { ...prev, posts: newPosts };
      });
    };

    const deletePost = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const index = newPosts.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          newPosts.splice(index, 1);
        }
        return { ...prev, posts: newPosts };
      });
    };

    const PostStats = memo(() => {
      const ref = useRef<HTMLDivElement>(null);

      useEffect(() => {
        debugRender(ref);
      });

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
          <span className="font-medium text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {item.status}
          </span>
        </div>
      );
    });

    const PostInfo = memo(() => {
      const ref = useRef<HTMLDivElement>(null);

      useEffect(() => {
        debugRender(ref);
      });

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
    });

    const PostComments = memo(() => {
      const ref = useRef<HTMLDivElement>(null);
      const displayedComments = item.comments.slice(0, 5);

      useEffect(() => {
        debugRender(ref);
      });

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
                  index < 5 && (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={item.id}
                      state={state}
                      setState={setState}
                    />
                  )
              )}
            </div>
          )}
        </>
      );
    });

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
  }
);

const CommentItem = memo(
  ({
    comment,
    postId,
    state,
    setState,
  }: {
    comment: Post['comments'][number];
    postId: string;
    state: ComplexState;
    setState: React.Dispatch<React.SetStateAction<ComplexState>>;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { toggleBenchmark } = useBenchmark();

    useEffect(() => {
      debugRender(ref);
    });

    const addLike = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const postIndex = newPosts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          const newComments = [...newPosts[postIndex].comments];
          const commentIndex = newComments.findIndex((c) => c.id === comment.id);
          if (commentIndex !== -1) {
            const newLikes = [...newComments[commentIndex].likes, shortId()];
            newComments[commentIndex] = { ...newComments[commentIndex], likes: newLikes };
            newPosts[postIndex] = { ...newPosts[postIndex], comments: newComments };
          }
        }
        return { ...prev, posts: newPosts };
      });
    };

    const addReply = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const postIndex = newPosts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          const newComments = [...newPosts[postIndex].comments];
          const commentIndex = newComments.findIndex((c) => c.id === comment.id);
          if (commentIndex !== -1) {
            const newReplies = [
              ...newComments[commentIndex].replies,
              {
                ...structuredClone(dummyContent.posts[0].comments[0]),
                id: shortId(),
              },
            ];
            newComments[commentIndex] = { ...newComments[commentIndex], replies: newReplies };
            newPosts[postIndex] = { ...newPosts[postIndex], comments: newComments };
          }
        }
        return { ...prev, posts: newPosts };
      });
    };

    const deleteComment = () => {
      console.log('Delete comment', comment.id);
    };

    const CommentStats = memo(() => {
      const ref = useRef<HTMLDivElement>(null);

      useEffect(() => {
        debugRender(ref);
      });

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
    });

    const CommentReplies = memo(() => {
      const ref = useRef<HTMLDivElement>(null);
      const replies = comment.replies.slice(0, 3);

      useEffect(() => {
        debugRender(ref);
      });

      return (
        <>
          {replies.length > 0 && (
            <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-300">
              <h5 className="text-xs font-semibold text-gray-600 mb-2">Replies ({replies.length.toLocaleString()})</h5>
              <div className="space-y-3">
                {replies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    postId={postId}
                    commentId={comment.id}
                    state={state}
                    setState={setState}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      );
    });

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
    setState,
  }: {
    reply: Post['comments'][number]['replies'][number];
    postId: string;
    commentId: string;
    state: ComplexState;
    setState: React.Dispatch<React.SetStateAction<ComplexState>>;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { toggleBenchmark } = useBenchmark();

    useEffect(() => {
      debugRender(ref);
    });

    const addLike = () => {
      setState((prev) => {
        const newPosts = [...prev.posts];
        const postIndex = newPosts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          const newComments = [...newPosts[postIndex].comments];
          const commentIndex = newComments.findIndex((c) => c.id === commentId);
          if (commentIndex !== -1) {
            const newReplies = [...newComments[commentIndex].replies];
            const replyIndex = newReplies.findIndex((r) => r.id === reply.id);
            if (replyIndex !== -1) {
              const newLikes = [...newReplies[replyIndex].likes, shortId()];
              newReplies[replyIndex] = { ...newReplies[replyIndex], likes: newLikes };
              newComments[commentIndex] = { ...newComments[commentIndex], replies: newReplies };
              newPosts[postIndex] = { ...newPosts[postIndex], comments: newComments };
            }
          }
        }
        return { ...prev, posts: newPosts };
      });
    };

    const deleteReply = () => {
      console.log('Delete reply', reply.id);
    };

    const LikesCount = memo(() => {
      const ref = useRef<HTMLButtonElement>(null);

      useEffect(() => {
        debugRender(ref);
      });

      return (
        <button
          ref={ref}
          onClick={() => toggleBenchmark(addLike)}
          className="flex items-center gap-1 hover:text-red-500">
          <Heart size={12} />
          {reply.likes.length.toLocaleString()} ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
      );
    });

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

const ComplexStats = memo(({ state }: { state: ComplexState }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    debugRender(ref);
  });

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
});

const CategoriesAndTagsSection = ({
  state,
  setState,
}: {
  state: ComplexState;
  setState: React.Dispatch<React.SetStateAction<ComplexState>>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { benchmark } = useBenchmark();

  useEffect(() => {
    debugRender(ref);
  });

  const addCategories = () => {
    benchmark(() => {
      setState((prev) => {
        const newCategories = [...prev.categories];
        newCategories.push(structuredClone({ ...dummyContent.categories[0], id: shortId() }));
        return { ...prev, categories: newCategories };
      });
    });
  };

  const addTags = () => {
    benchmark(() => {
      setState((prev) => {
        const newTags = [...prev.tags];
        newTags.push(structuredClone({ ...dummyContent.tags[0], id: shortId() }));
        return { ...prev, tags: newTags };
      });
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
          <CategoryList state={state} setState={setState} />
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
          <TagList state={state} setState={setState} />
        </div>
      </div>
    </div>
  );
};

const CategoryList = ({
  state,
  setState,
}: {
  state: ComplexState;
  setState: React.Dispatch<React.SetStateAction<ComplexState>>;
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    debugRender(ref);
  });

  if (!state.categories.length) {
    return <p className="text-gray-500 text-center py-4">No categories yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {state.categories.map((category) => (
        <CategoryItem key={category.id} item={category} state={state} setState={setState} />
      ))}
    </ul>
  );
};

const CategoryItem = memo(
  ({
    item,
    setState,
  }: {
    item: Category;
    state: ComplexState;
    setState: React.Dispatch<React.SetStateAction<ComplexState>>;
  }) => {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
      debugRender(ref);
    });

    const deleteCategory = () => {
      setState((prev) => {
        const newCategories = [...prev.categories];
        const index = newCategories.findIndex((c) => c.id === item.id);
        if (index !== -1) {
          newCategories.splice(index, 1);
        }
        return { ...prev, categories: newCategories };
      });
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
  }
);

const TagList = ({
  state,
  setState,
}: {
  state: ComplexState;
  setState: React.Dispatch<React.SetStateAction<ComplexState>>;
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    debugRender(ref);
  });

  if (!state.tags.length) {
    return <p className="text-gray-500 text-center py-4">No tags yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {state.tags.map((tag) => (
        <TagItem key={tag.id} item={tag} state={state} setState={setState} />
      ))}
    </ul>
  );
};

const TagItem = memo(
  ({
    item,
    setState,
  }: {
    item: TagType;
    state: ComplexState;
    setState: React.Dispatch<React.SetStateAction<ComplexState>>;
  }) => {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
      debugRender(ref);
    });

    const deleteTag = () => {
      setState((prev) => {
        const newTags = [...prev.tags];
        const index = newTags.findIndex((t) => t.id === item.id);
        if (index !== -1) {
          newTags.splice(index, 1);
        }
        return { ...prev, tags: newTags };
      });
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
  }
);
