import { useEffect, useState } from "react";
import { createPost } from "../api/posts";
import { getUserGroups } from "../api/groups";
import { getCategories } from "../api/categories";
import { getConnectedUser } from "../api/storage";

interface UserGroup {
  id: number;
  name: string;
}

interface GroupMembership {
  id: number;
  active: boolean;
  hasLeft: boolean;
  group: UserGroup;
}

interface Category {
  id: number;
  title: string;
  description: string;
}

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [groupId, setGroupId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadGroups();
    loadCategories();
  }, []);

  const loadGroups = async () => {
    try {
      const connectedUser = getConnectedUser();
      if (!connectedUser) return;

      const data = await getUserGroups(connectedUser.id);
      setGroups(data);
    } catch (error) {
      console.error(error);
    }
  };

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

    if (!title.trim() || !content.trim()) {
      setMessage("Titre et contenu obligatoires");
      return;
    }

    if (!isPublic && !groupId) {
      setMessage("Un post privé doit être lié à un groupe");
      return;
    }

    try {
      await createPost({
        title,
        content,
        isPublic,
        authorId: connectedUser.id,
        groupId: isPublic ? null : Number(groupId),
        categoryId: categoryId ? Number(categoryId) : null,
      });

      setMessage("Post créé avec succès");
      setTitle("");
      setContent("");
      setIsPublic(true);
      setGroupId("");
      setCategoryId("");
    } catch (error) {
      setMessage("Erreur lors de la création du post");
      console.error(error);
    }
  };

  return (
    <div className="form-container card">
      <h1>Créer un post</h1>

      <form onSubmit={handleSubmit} className="stack">
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

        <select
          value={isPublic ? "PUBLIC" : "PRIVATE"}
          onChange={(e) => setIsPublic(e.target.value === "PUBLIC")}
        >
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

        {!isPublic && (
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">Choisir un groupe</option>
            {groups.map((membership) => (
              <option key={membership.group.id} value={membership.group.id}>
                {membership.group.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit">Créer</button>
      </form>

      <p className="message">{message}</p>
    </div>
  );
}

export default CreatePostPage;