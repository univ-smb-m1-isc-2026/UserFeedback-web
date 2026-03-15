import { useEffect, useState } from "react";
import { createPost } from "../api/posts";
import { getCategories } from "../api/categories";
import { getConnectedUser } from "../api/storage";

interface Category {
  id: number;
  title: string;
  description: string;
}

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const connectedUser = getConnectedUser();

    if (!connectedUser) {
      setMessage("Vous devez être connecté pour créer un post");
      return;
    }

    try {
      await createPost({
        title,
        content,
        visibility,
        authorId: connectedUser.id,
        categoryId: Number(categoryId),
      });

      setMessage("Post créé avec succès");
      setTitle("");
      setContent("");
      setVisibility("PUBLIC");
      setCategoryId("");
    } catch (error) {
      setMessage("Erreur lors de la création du post");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Créer un post</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}
      >
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />

        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>

        <button type="submit">Créer</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default CreatePostPage;