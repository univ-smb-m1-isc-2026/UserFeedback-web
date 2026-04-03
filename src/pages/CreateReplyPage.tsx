import { useEffect, useState } from "react";
import { createReply } from "../api/replies";
import { getPosts } from "../api/posts";
import { getConnectedUser } from "../api/storage";

interface Post {
  id: number;
  title: string;
  public: boolean;
  group?: {
    id: number;
  } | null;
}

function CreateReplyPage() {
  const [content, setContent] = useState("");
  const [postId, setPostId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const connectedUser = getConnectedUser();
      if (!connectedUser) return;

      const data = await getPosts(connectedUser.id);
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const connectedUser = getConnectedUser();

    if (!connectedUser) {
      setMessage("Vous devez être connecté pour créer une réponse");
      return;
    }

    if (!content.trim()) {
      setMessage("Le contenu de la réponse est obligatoire");
      return;
    }

    if (!postId) {
      setMessage("Vous devez choisir un post");
      return;
    }

    const selectedPost = posts.find((p) => p.id === Number(postId));

    if (!selectedPost) {
      setMessage("Post introuvable");
      return;
    }

    try {
      await createReply({
        content,
        isPublic: selectedPost.public,
        groupId: selectedPost.group?.id ?? null,
        authorId: connectedUser.id,
        postId: Number(postId),
      });

      setMessage("Réponse créée avec succès");
      setContent("");
      setPostId("");
    } catch (error) {
      setMessage("Erreur lors de la création de la réponse");
      console.error(error);
    }
  };

  return (
    <div className="form-container card">
      <h1>Créer une réponse</h1>

      <form onSubmit={handleSubmit} className="stack">
        <textarea
          placeholder="Contenu de la réponse"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />

        <select value={postId} onChange={(e) => setPostId(e.target.value)}>
          <option value="">Choisir un post</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title} - {post.public ? "PUBLIC" : "PRIVATE"}
            </option>
          ))}
        </select>

        <button type="submit">Créer</button>
      </form>

      <p className="message">{message}</p>
    </div>
  );
}

export default CreateReplyPage;