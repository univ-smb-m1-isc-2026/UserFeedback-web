import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { getReplies, createReply } from "../api/replies";
import { createVote, getVotes } from "../api/votes";
import { getConnectedUser } from "../api/storage";

interface Author {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Category {
  id: number;
  title: string;
  description: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  visibility: string;
  isPublic?: boolean;
  group?: {
    id: number;
  } | null;
  author: Author;
  category?: Category;
}

interface Reply {
  id: number;
  content: string;
  visibility: string;
  isPublic?: boolean;
  author: Author;
  post: {
    id: number;
  };
}

interface Vote {
  id: number;
  value: number;
  user: {
    id: number;
  };
  post?: {
    id: number;
  } | null;
  reply?: {
    id: number;
  } | null;
}

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [message, setMessage] = useState("");
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});

  const connectedUser = getConnectedUser();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const userId = connectedUser?.id ?? 1;

      const postsData = await getPosts(userId);
      setPosts(postsData);

      const repliesPerPost = await Promise.all(
        postsData.map((post: { id: number; }) => getReplies(post.id, userId))
      );

      setReplies(repliesPerPost.flat());

      const votesData = await getVotes();
      setVotes(votesData);
    } catch (error) {
      console.error(error);
    }
  };

  const getRepliesForPost = (postId: number) => {
    return replies.filter((reply) => reply.post?.id === postId);
  };

  const getPostScore = (postId: number) => {
    return votes
      .filter((vote) => vote.post?.id === postId)
      .reduce((sum, vote) => sum + vote.value, 0);
  };

  const getReplyScore = (replyId: number) => {
    return votes
      .filter((vote) => vote.reply?.id === replyId)
      .reduce((sum, vote) => sum + vote.value, 0);
  };

  const handleVotePost = async (postId: number, value: number) => {
    if (!connectedUser) {
      setMessage("Vous devez être connecté pour voter");
      return;
    }

    try {
      await createVote({
        value,
        userId: connectedUser.id,
        postId,
        replyId: null,
      });

      setMessage("");
      await loadAll();
    } catch (error) {
      setMessage("Erreur lors du vote");
      console.error(error);
    }
  };

  const handleVoteReply = async (replyId: number, value: number) => {
    if (!connectedUser) {
      setMessage("Vous devez être connecté pour voter");
      return;
    }

    try {
      await createVote({
        value,
        userId: connectedUser.id,
        postId: null,
        replyId,
      });

      setMessage("");
      await loadAll();
    } catch (error) {
      setMessage("Erreur lors du vote");
      console.error(error);
    }
  };

  const handleReplyChange = (postId: number, value: string) => {
    setReplyContents((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCreateReply = async (post: Post) => {
    if (!connectedUser) {
      setMessage("Vous devez être connecté pour répondre");
      return;
    }

    const content = replyContents[post.id]?.trim();

    if (!content) {
      setMessage("La réponse ne peut pas être vide");
      return;
    }

    try {
      await createReply({
        content,
        isPublic: post.isPublic ?? true,
        groupId: post.group?.id ?? null,
        authorId: connectedUser.id,
        postId: post.id,
      });

      setReplyContents((prev) => ({
        ...prev,
        [post.id]: "",
      }));

      setMessage("");
      await loadAll();
    } catch (error) {
      setMessage("Erreur lors de la création de la réponse");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <p className="message">{message}</p>

      {posts.length === 0 && <p>Aucun post</p>}

      <ul className="posts-list list-reset">
        {posts.map((post) => {
          const postReplies = getRepliesForPost(post.id);

          return (
            <li key={post.id} className="card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>

              <p className="meta">
                {post.author?.username} • {post.category?.title ?? "Sans catégorie"} •{" "}
                {post.isPublic ? "PUBLIC" : "PRIVATE"}
              </p>

              <div className="vote-row">
                {connectedUser && (
                  <>
                    <button onClick={() => handleVotePost(post.id, 1)}>+1</button>
                    <button onClick={() => handleVotePost(post.id, -1)}>-1</button>
                  </>
                )}
                <span className="score-badge">{getPostScore(post.id)}</span>
              </div>

              {connectedUser && (
                <div className="stack" style={{ marginTop: "1rem" }}>
                  <textarea
                    placeholder="Écrire une réponse..."
                    rows={3}
                    value={replyContents[post.id] ?? ""}
                    onChange={(e) => handleReplyChange(post.id, e.target.value)}
                  />
                  <div>
                    <button onClick={() => handleCreateReply(post)}>Répondre</button>
                  </div>
                </div>
              )}

              <h3 className="section-title">Réponses</h3>

              {postReplies.length === 0 ? (
                <p>Aucune réponse</p>
              ) : (
                <div className="stack">
                  {postReplies.map((reply) => (
                    <div key={reply.id} className="reply-card">
                      <p>{reply.content}</p>

                      <p className="meta">
                        {reply.author?.username} • {reply.isPublic ? "PUBLIC" : "PRIVATE"}
                      </p>

                      <div className="vote-row">
                        {connectedUser && (
                          <>
                            <button onClick={() => handleVoteReply(reply.id, 1)}>+1</button>
                            <button onClick={() => handleVoteReply(reply.id, -1)}>-1</button>
                          </>
                        )}
                        <span className="score-badge">
                          {getReplyScore(reply.id)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostsPage;