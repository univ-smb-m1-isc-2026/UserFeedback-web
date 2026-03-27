import { useEffect, useState } from "react";
import { createReply } from "../api/replies";
import { getPosts } from "../api/posts";
import { getConnectedUser } from "../api/storage";

interface Post {
  id: number;
  title: string;
}

function CreateReplyPage() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [postId, setPostId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
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

    try {
      await createReply({
        content,
        visibility,
        authorId: connectedUser.id,
        postId: Number(postId),
      });

      setMessage("Réponse créée avec succès");
      setContent("");
      setVisibility("PUBLIC");
      setPostId("");
    } catch (error) {
      setMessage("Erreur lors de la création de la réponse");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Créer une réponse</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}
      >
        <textarea
          placeholder="Contenu de la réponse"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />

        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        <select value={postId} onChange={(e) => setPostId(e.target.value)}>
          <option value="">Choisir un post</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>

        <button type="submit">Créer</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default CreateReplyPage;