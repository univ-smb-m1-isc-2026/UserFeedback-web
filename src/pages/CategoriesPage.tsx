import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";

interface Category {
  id: number;
  name: string;
  description: string;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <div>
      <h1>Catégories</h1>

      {categories.length === 0 && <p>Aucune catégorie</p>}

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesPage;