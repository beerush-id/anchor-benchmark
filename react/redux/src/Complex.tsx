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
import { memo, useEffect, useRef } from 'react';
import dummyData from '@anchor-benchmark/shared/data/dummy-data.json';
import { useAppDispatch, useAppSelector } from './store';
import {
  addCategories,
  addCommentLike,
  addCommentReply,
  addPostComment,
  addPostLike,
  addPosts,
  addReplyLike,
  addTags,
  deleteCategory,
  deletePost,
  deleteTag,
  incrementPostViews,
} from './complexSlice';

// Add typings to the dummy data.
const dummyContent = dummyData as unknown as ComplexState;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7">
            <PostsSection />
          </div>
          <div className="lg:col-span-3">
            <CategoriesAndTagsSection />
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-xs">
          <p className="text-gray-500 text-sm text-center px-10 py-6">
            This benchmark demonstrates complex nested state management with Redux.
          </p>
        </div>
      </div>
    </div>
  );
}

const PostsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const dispatch = useAppDispatch();

  const addPostsHandler = () => {
    benchmark(() => {
      const newPosts = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.posts[0]),
        id: shortId(),
      }));
      dispatch(addPosts(newPosts));
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
          onClick={addPostsHandler}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
          <BarChart2 size={16} />
          Add {BENCHMARK_SIZE.toLocaleString()} Posts
        </button>
      </div>
      <PostList />
    </div>
  );
};

const PostList = () => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const posts = useAppSelector((state) => state.complex.posts);

  if (!posts.length) {
    return <p className="text-gray-500 text-center py-4">No posts yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {posts.map((post) => (
        <PostItem key={post.id} item={post} />
      ))}
    </ul>
  );
};

const PostItem = memo(({ item }: { item: Post }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const dispatch = useAppDispatch();

  const incrementViews = () => {
    dispatch(incrementPostViews(item.id));
  };

  const addLike = () => {
    dispatch(addPostLike({ postId: item.id, likeId: shortId() }));
  };

  const addComment = () => {
    dispatch(
      addPostComment({
        postId: item.id,
        comment: { ...structuredClone(dummyContent.posts[0].comments[0]), id: shortId() },
      })
    );
  };

  const deletePostHandler = () => {
    dispatch(deletePost(item.id));
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
              (comment, index) => index < 5 && <CommentItem key={comment.id} comment={comment} postId={item.id} />
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
          onClick={deletePostHandler}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
          <Trash2 size={16} />
        </button>
      </div>
      <PostComments />
    </li>
  );
});

const CommentItem = memo(({ comment, postId }: { comment: Post['comments'][number]; postId: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const dispatch = useAppDispatch();

  const addLike = () => {
    dispatch(addCommentLike({ postId, commentId: comment.id, likeId: shortId() }));
  };

  const addReply = () => {
    dispatch(
      addCommentReply({
        postId,
        commentId: comment.id,
        reply: { ...structuredClone(dummyContent.posts[0].comments[0]), id: shortId() },
      })
    );
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
                <ReplyItem key={reply.id} reply={reply} postId={postId} commentId={comment.id} />
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
});

const ReplyItem = memo(
  ({
    reply,
    postId,
    commentId,
  }: {
    reply: Post['comments'][number]['replies'][number];
    postId: string;
    commentId: string;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const dispatch = useAppDispatch();

    const addLike = () => {
      dispatch(addReplyLike({ postId, commentId, replyId: reply.id, likeId: shortId() }));
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

const ComplexStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const postsCount = useAppSelector((state) => state.complex.posts.length);
  const categoriesCount = useAppSelector((state) => state.complex.categories.length);
  const tagsCount = useAppSelector((state) => state.complex.tags.length);

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

const CategoriesAndTagsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  return (
    <div ref={ref} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xs p-6">
        <ComplexStats />
      </div>

      <div className="bg-white rounded-2xl shadow-xs p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Folder className="text-purple-600" size={24} />
          </div>
          <h2 className="font-semibold text-gray-800 text-xl">Categories</h2>
        </div>
        <div className="mb-4">
          <AddCategoriesButton />
        </div>
        <div className="max-h-[512px] overflow-y-auto pr-2">
          <CategoryList />
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
          <AddTagsButton />
        </div>
        <div className="max-h-[512px] overflow-y-auto pr-2">
          <TagList />
        </div>
      </div>
    </div>
  );
};

const AddCategoriesButton = () => {
  const dispatch = useAppDispatch();

  const addCategoriesHandler = () => {
    benchmark(() => {
      const newCategories = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.categories[0]),
        id: shortId(),
      }));
      dispatch(addCategories(newCategories));
    });
  };

  return (
    <button
      onClick={addCategoriesHandler}
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
      <BarChart2 size={16} />
      Benchmark {BENCHMARK_SIZE.toLocaleString()} Categories
    </button>
  );
};

const AddTagsButton = () => {
  const dispatch = useAppDispatch();

  const addTagsHandler = () => {
    benchmark(() => {
      const newTags = Array.from({ length: 1 }, () => ({
        ...structuredClone(dummyContent.tags[0]),
        id: shortId(),
      }));
      dispatch(addTags(newTags));
    });
  };

  return (
    <button
      onClick={addTagsHandler}
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
      <BarChart2 size={16} />
      Benchmark {BENCHMARK_SIZE.toLocaleString()} Tags
    </button>
  );
};

const CategoryList = () => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const categories = useAppSelector((state) => state.complex.categories);

  if (!categories.length) {
    return <p className="text-gray-500 text-center py-4">No categories yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} item={category} />
      ))}
    </ul>
  );
};

const CategoryItem = memo(({ item }: { item: Category }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const dispatch = useAppDispatch();

  const onDeleteCategory = () => {
    dispatch(deleteCategory(item.id));
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
        onClick={onDeleteCategory}
        className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
        <Trash2 size={16} />
      </button>
    </li>
  );
});

const TagList = () => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  const tags = useAppSelector((state) => state.complex.tags);

  if (!tags.length) {
    return <p className="text-gray-500 text-center py-4">No tags yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {tags.map((tag) => (
        <TagItem key={tag.id} item={tag} />
      ))}
    </ul>
  );
};

const TagItem = memo(({ item }: { item: TagType }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const dispatch = useAppDispatch();

  const onDeleteTag = () => {
    dispatch(deleteTag(item.id));
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
        onClick={onDeleteTag}
        className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-1">
        <Trash2 size={16} />
      </button>
    </li>
  );
});
