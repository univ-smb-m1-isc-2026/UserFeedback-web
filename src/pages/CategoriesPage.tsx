import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../api/categories";
import { getConnectedUser } from "../api/storage";

interface Category {
  id: number;
  title: string;
  description: string;
}

function CategoriesPage() {
  const connectedUser = getConnectedUser();
  const isAdmin = connectedUser?.role === "ADMIN";

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      setMessage("Erreur lors du chargement des catégories");
    }
  };

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!connectedUser || !isAdmin) {
      setMessage("Action réservée aux admins");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage("Titre et description obligatoires");
      return;
    }

    try {
      await createCategory(
        {
          title,
          description,
        },
        connectedUser.id
      );

      setTitle("");
      setDescription("");
      setMessage("Catégorie créée avec succès");
      await loadCategories();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la création de la catégorie");
    }
  };

  return (
    <div className="stack">
      <div>
        <h1>Catégories</h1>
        <p className="message">{message}</p>
      </div>

      {isAdmin && (
        <div className="card form-container">
          <h2>Créer une catégorie</h2>

          <form onSubmit={handleCreateCategory} className="stack">
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <button type="submit">Créer</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Liste des catégories</h2>

        {categories.length === 0 ? (
          <p>Aucune catégorie</p>
        ) : (
          <ul className="list-reset stack">
            {categories.map((category) => (
              <li key={category.id} className="reply-card">
                <strong>{category.title}</strong>
                <p style={{ marginBottom: 0 }}>{category.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;