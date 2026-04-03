import { useEffect, useState } from "react";
import { createReply } from "../api/replies";
import { getPosts } from "../api/posts";
import { getConnectedUser } from "../api/storage";

interface Post {
  id: number;
  title: string;
  isPublic?: boolean;
  group?: {
    id: number;
  } | null;
}

function CreateReplyPage() {
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
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

    const selectedPost = posts.find((p) => p.id === Number(postId));

    try {
      await createReply({
        content,
        isPublic,
        groupId: selectedPost?.group?.id ?? null,
        authorId: connectedUser.id,
        postId: Number(postId),
      });

      setMessage("Réponse créée avec succès");
      setContent("");
      setIsPublic(true);
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "500px",
        }}
      >
        <textarea
          placeholder="Contenu de la réponse"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />

        {/* visibilité */}
        <select
          value={isPublic ? "PUBLIC" : "PRIVATE"}
          onChange={(e) => setIsPublic(e.target.value === "PUBLIC")}
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        {/* choix du post */}
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