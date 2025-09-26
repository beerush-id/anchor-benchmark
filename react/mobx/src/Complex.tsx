import { observer } from 'mobx-react-lite';
import { makeAutoObservable, observable, runInAction } from 'mobx';
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
import { useEffect, useRef } from 'react';
import dummyData from '@anchor-benchmark/shared/data/dummy-data.json';

// Add typings to the dummy data.
const dummyContent = dummyData as unknown as ComplexState;

// MobX Store for Complex State
class ComplexStore {
  state: ComplexState;

  constructor() {
    this.state = observable(structuredClone(dummyContent) as ComplexState);
    makeAutoObservable(this);
  }

  addPostBenchmark() {
    return evaluate(() => {
      runInAction(() => {
        const newPost = structuredClone({ ...dummyContent.posts[0], id: shortId() });
        this.state.posts.push(newPost);
      });
    }, BENCHMARK_SIZE);
  }

  deletePost(postId: string) {
    const index = this.state.posts.findIndex((post) => post.id === postId);
    if (index !== -1) {
      runInAction(() => {
        this.state.posts.splice(index, 1);
      });
    }
  }

  incrementPostViews(postId: string) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post) {
      runInAction(() => {
        post.views++;
      });
    }
  }

  incrementPostViewsBenchmark(postId: string) {
    return evaluate(() => {
      runInAction(() => {
        this.incrementPostViews(postId);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  addPostLike(postId: string) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post) {
      runInAction(() => {
        post.likes.push(shortId());
      });
    }
  }

  addPostLikeBenchmark(postId: string) {
    return evaluate(() => {
      runInAction(() => {
        this.addPostLike(postId);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  addPostComment(postId: string) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post) {
      runInAction(() => {
        const newComment = {
          ...structuredClone(dummyContent.posts[0].comments[0]),
          id: shortId(),
        };
        post.comments.push(newComment);
      });
    }
  }

  addPostCommentBenchmark(postId: string) {
    return evaluate(() => {
      runInAction(() => {
        this.addPostComment(postId);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  addCategoryBenchmark() {
    return evaluate(() => {
      runInAction(() => {
        const newCategory = structuredClone({ ...dummyContent.categories[0], id: shortId() });
        this.state.categories.push(newCategory);
      });
    }, BENCHMARK_SIZE);
  }

  deleteCategory(categoryId: string) {
    const index = this.state.categories.findIndex((category) => category.id === categoryId);
    if (index !== -1) {
      runInAction(() => {
        this.state.categories.splice(index, 1);
      });
    }
  }

  addTagBenchmark() {
    return evaluate(() => {
      runInAction(() => {
        const newTag = structuredClone({ ...dummyContent.tags[0], id: shortId() });
        this.state.tags.push(newTag);
      });
    }, BENCHMARK_SIZE);
  }

  deleteTag(tagId: string) {
    const index = this.state.tags.findIndex((tag) => tag.id === tagId);
    if (index !== -1) {
      runInAction(() => {
        this.state.tags.splice(index, 1);
      });
    }
  }

  // Comment actions
  addCommentLike(postId: string, commentIndex: number) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post && post.comments[commentIndex]) {
      runInAction(() => {
        post.comments[commentIndex].likes.push(shortId());
      });
    }
  }

  addCommentLikeBenchmark(postId: string, commentIndex: number) {
    return evaluate(() => {
      runInAction(() => {
        this.addCommentLike(postId, commentIndex);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  addCommentReply(postId: string, commentIndex: number) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post && post.comments[commentIndex]) {
      runInAction(() => {
        const newReply = {
          ...structuredClone(dummyContent.posts[0].comments[0]),
          id: shortId(),
        };
        post.comments[commentIndex].replies.push(newReply);
      });
    }
  }

  addCommentReplyBenchmark(postId: string, commentIndex: number) {
    return evaluate(() => {
      runInAction(() => {
        this.addCommentReply(postId, commentIndex);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }

  // Reply actions
  addReplyLike(postId: string, commentIndex: number, replyIndex: number) {
    const post = this.state.posts.find((p) => p.id === postId);
    if (post && post.comments[commentIndex] && post.comments[commentIndex].replies[replyIndex]) {
      runInAction(() => {
        post.comments[commentIndex].replies[replyIndex].likes.push(shortId());
      });
    }
  }

  addReplyLikeBenchmark(postId: string, commentIndex: number, replyIndex: number) {
    return evaluate(() => {
      runInAction(() => {
        this.addReplyLike(postId, commentIndex, replyIndex);
      });
    }, BENCHMARK_TOGGLE_SIZE);
  }
}

// Create store instance
const complexStore = new ComplexStore();

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
            This benchmark demonstrates complex nested state management with MobX.
          </p>
        </div>
      </div>
    </div>
  );
}

const PostsSection = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-xs p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart2 className="text-blue-600" size={24} />
        </div>
        <h2 className="font-semibold text-gray-800 text-xl">Posts</h2>
        <span className="flex-1"></span>
        <button
          onClick={() => complexStore.addPostBenchmark()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
          <BarChart2 size={16} />
          Add {BENCHMARK_SIZE.toLocaleString()} Posts
        </button>
      </div>
      <PostList />
    </div>
  );
});

const PostList = observer(() => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  if (!complexStore.state.posts.length) {
    return <p className="text-gray-500 text-center py-4">No posts yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {complexStore.state.posts.map((post) => (
        <PostItem key={post.id} item={post} />
      ))}
    </ul>
  );
});

const PostItem = observer(({ item }: { item: Post }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const incrementViews = () => {
    complexStore.incrementPostViewsBenchmark(item.id);
  };

  const addLike = () => {
    complexStore.addPostLikeBenchmark(item.id);
  };

  const addComment = () => {
    complexStore.addPostCommentBenchmark(item.id);
  };

  const deletePost = () => {
    complexStore.deletePost(item.id);
  };

  return (
    <li ref={ref} className="mb-6 last:mb-0">
      <PostInfo item={item} />
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          onClick={incrementViews}
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1">
          <Eye size={16} />
          View ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
        <button
          onClick={addLike}
          className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
          <Heart size={16} />
          Like ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
        </button>
        <button
          onClick={addComment}
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
      <PostComments item={item} />
    </li>
  );
});

const PostInfo = observer(({ item }: { item: Post }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  return (
    <div ref={ref} className="flex flex-col bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-xl mb-2">{item.title}</h3>
          <PostStats item={item} />
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

const PostStats = observer(({ item }: { item: Post }) => {
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
});

const PostComments = observer(({ item }: { item: Post }) => {
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
              index < 5 && <CommentItem key={comment.id} comment={comment} postId={item.id} commentIndex={index} />
          )}
        </div>
      )}
    </>
  );
});

const CommentItem = observer(
  ({ comment, postId, commentIndex }: { comment: Post['comments'][number]; postId: string; commentIndex: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const addLike = () => {
      complexStore.addCommentLikeBenchmark(postId, commentIndex);
    };

    const addReply = () => {
      complexStore.addCommentReplyBenchmark(postId, commentIndex);
    };

    const deleteComment = () => {
      console.log('Delete comment', comment.id);
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
              <div className="flex gap-4 items-center">
                <button onClick={addLike} className="flex items-center gap-1 hover:text-red-500">
                  <span className="flex items-center gap-1 bg-slate-200 rounded-sm px-1 py-0.5 font-medium text-xs">
                    <Heart size={14} />
                    <span>{comment.likes.length.toLocaleString()}</span>
                  </span>
                  <span className="font-medium">Like ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)</span>
                </button>
                <button onClick={addReply} className="flex items-center gap-1 hover:text-blue-500">
                  <span className="flex items-center gap-1 bg-slate-200 rounded-sm px-1 py-0.5 font-medium text-xs">
                    <Reply size={14} />
                    <span>{comment.replies.length.toLocaleString()}</span>
                  </span>
                  <span className="font-medium">Reply ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)</span>
                </button>
              </div>
              <button onClick={deleteComment} className="flex items-center gap-1 hover:text-gray-800">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
        <CommentReplies replies={comment.replies} postId={postId} commentIndex={commentIndex} />
      </div>
    );
  }
);

const CommentReplies = observer(
  ({
    replies,
    postId,
    commentIndex,
  }: {
    replies: Post['comments'][number]['replies'];
    postId: string;
    commentIndex: number;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const displayedReplies = replies.slice(0, 3);

    return (
      <>
        {displayedReplies.length > 0 && (
          <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-300">
            <h5 className="text-xs font-semibold text-gray-600 mb-2">Replies ({replies.length.toLocaleString()})</h5>
            <div className="space-y-3">
              {displayedReplies.map((reply, replyIndex) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  postId={postId}
                  commentIndex={commentIndex}
                  replyIndex={replyIndex}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
);

const ReplyItem = observer(
  ({
    reply,
    postId,
    commentIndex,
    replyIndex,
  }: {
    reply: Post['comments'][number]['replies'][number];
    postId: string;
    commentIndex: number;
    replyIndex: number;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useDebugRender(ref);

    const addLike = () => {
      complexStore.addReplyLikeBenchmark(postId, commentIndex, replyIndex);
    };

    const deleteReply = () => {
      console.log('Delete reply', reply.id);
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
              <button onClick={addLike} className="flex items-center gap-1 hover:text-red-500">
                <Heart size={12} />
                {reply.likes.length.toLocaleString()} ({BENCHMARK_TOGGLE_SIZE.toLocaleString()}x)
              </button>
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

const ComplexStats = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  useDebugRender(ref);

  const postsCount = complexStore.state.posts.length;
  const categoriesCount = complexStore.state.categories.length;
  const tagsCount = complexStore.state.tags.length;

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

const CategoriesAndTagsSection = observer(() => {
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
          <button
            onClick={() => complexStore.addCategoryBenchmark()}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
            <BarChart2 size={16} />
            Benchmark {BENCHMARK_SIZE.toLocaleString()} Categories
          </button>
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
          <button
            onClick={() => complexStore.addTagBenchmark()}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
            <BarChart2 size={16} />
            Benchmark {BENCHMARK_SIZE.toLocaleString()} Tags
          </button>
        </div>
        <div className="max-h-[512px] overflow-y-auto pr-2">
          <TagList />
        </div>
      </div>
    </div>
  );
});

const CategoryList = observer(() => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  if (!complexStore.state.categories.length) {
    return <p className="text-gray-500 text-center py-4">No categories yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {complexStore.state.categories.map((category) => (
        <CategoryItem key={category.id} item={category} />
      ))}
    </ul>
  );
});

const CategoryItem = observer(({ item }: { item: Category }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const deleteCategory = () => {
    complexStore.deleteCategory(item.id);
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

const TagList = observer(() => {
  const ref = useRef<HTMLUListElement>(null);
  useDebugRender(ref);

  if (!complexStore.state.tags.length) {
    return <p className="text-gray-500 text-center py-4">No tags yet.</p>;
  }

  return (
    <ul ref={ref} className="mt-2">
      {complexStore.state.tags.map((tag) => (
        <TagItem key={tag.id} item={tag} />
      ))}
    </ul>
  );
});

const TagItem = observer(({ item }: { item: TagType }) => {
  const ref = useRef<HTMLLIElement>(null);
  useDebugRender(ref);

  const deleteTag = () => {
    complexStore.deleteTag(item.id);
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
