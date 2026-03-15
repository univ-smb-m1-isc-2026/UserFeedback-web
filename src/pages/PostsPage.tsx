import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";

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

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

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

  return (
    <div>
      <h1>Posts</h1>

      {posts.length === 0 && <p>Aucun post</p>}

      <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: 0, listStyle: "none" }}>
        {posts.map((post) => (
          <li key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Visibilité :</strong> {post.visibility}</p>
            <p><strong>Auteur :</strong> {post.author?.username}</p>
            <p><strong>Catégorie :</strong> {post.category?.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPage;