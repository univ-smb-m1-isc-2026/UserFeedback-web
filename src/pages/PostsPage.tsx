import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { getReplies } from "../api/replies";
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
  author: Author;
  category: Category;
}

interface Reply {
  id: number;
  content: string;
  visibility: string;
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

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [postsData, repliesData, votesData] = await Promise.all([
        getPosts(),
        getReplies(),
        getVotes(),
      ]);

      setPosts(postsData);
      setReplies(repliesData);
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
    const connectedUser = getConnectedUser();

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

      setMessage("Vote ajouté");
      await loadAll();
    } catch (error) {
      setMessage("Erreur lors du vote");
      console.error(error);
    }
  };

  const handleVoteReply = async (replyId: number, value: number) => {
    const connectedUser = getConnectedUser();

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

      setMessage("Vote ajouté");
      await loadAll();
    } catch (error) {
      setMessage("Erreur lors du vote");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <p>{message}</p>

      {posts.length === 0 && <p>Aucun post</p>}

      <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: 0, listStyle: "none" }}>
        {posts.map((post) => {
          const postReplies = getRepliesForPost(post.id);

          return (
            <li key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p><strong>Visibilité :</strong> {post.visibility}</p>
              <p><strong>Auteur :</strong> {post.author?.username}</p>
              <p><strong>Catégorie :</strong> {post.category?.title}</p>
              <p><strong>Score :</strong> {getPostScore(post.id)}</p>

              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button onClick={() => handleVotePost(post.id, 1)}>+1</button>
                <button onClick={() => handleVotePost(post.id, -1)}>-1</button>
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
                <h3>Réponses</h3>

                {postReplies.length === 0 ? (
                  <p>Aucune réponse</p>
                ) : (
                  <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {postReplies.map((reply) => (
                      <li
                        key={reply.id}
                        style={{
                          backgroundColor: "#f7f7f7",
                          padding: "0.75rem",
                          borderRadius: "6px",
                        }}
                      >
                        <p>{reply.content}</p>
                        <p><strong>Auteur :</strong> {reply.author?.username}</p>
                        <p><strong>Visibilité :</strong> {reply.visibility}</p>
                        <p><strong>Score :</strong> {getReplyScore(reply.id)}</p>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => handleVoteReply(reply.id, 1)}>+1</button>
                          <button onClick={() => handleVoteReply(reply.id, -1)}>-1</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostsPage;