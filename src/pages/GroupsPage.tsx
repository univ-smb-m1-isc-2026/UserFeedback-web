import { useEffect, useState } from "react";
import {
  addUserToGroup,
  createGroup,
  getUserGroups,
  leaveGroup,
  searchUsers,
} from "../api/groups";
import { getConnectedUser } from "../api/storage";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

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

function GroupsPage() {
  const connectedUser = getConnectedUser();

  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (connectedUser) {
      loadGroups();
    }
  }, []);

  const loadGroups = async () => {
    if (!connectedUser) return;

    try {
      const data = await getUserGroups(connectedUser.id);
      setGroups(data);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors du chargement des groupes");
    }
  };

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!connectedUser) {
      setMessage("Vous devez être connecté");
      return;
    }

    if (!groupName.trim()) {
      setMessage("Le nom du groupe est obligatoire");
      return;
    }

    try {
      await createGroup({
        name: groupName,
        ownerId: connectedUser.id,
      });

      setGroupName("");
      setMessage("Groupe créé avec succès");
      await loadGroups();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la création du groupe");
    }
  };

  const handleSearchUsers = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      setUsers([]);
      return;
    }

    try {
      const data = await searchUsers(search);
      const filtered = connectedUser
        ? data.filter((user: User) => user.id !== connectedUser.id)
        : data;

      setUsers(filtered);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la recherche");
    }
  };

  const handleAddUser = async (userId: number) => {
    if (!selectedGroupId) {
      setMessage("Choisissez d'abord un groupe");
      return;
    }

    try {
      await addUserToGroup(Number(selectedGroupId), userId);
      setMessage("Utilisateur ajouté au groupe");
      await loadGroups();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout au groupe");
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    if (!connectedUser) return;

    try {
      await leaveGroup(groupId, connectedUser.id);
      setMessage("Vous avez quitté le groupe");
      await loadGroups();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la sortie du groupe");
    }
  };

  if (!connectedUser) {
    return (
      <div>
        <h1>Groupes</h1>
        <p>Vous devez être connecté pour gérer vos groupes.</p>
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <h1>Groupes</h1>
        <p className="message">{message}</p>
      </div>

      <div className="card form-container">
        <h2>Créer un groupe</h2>

        <form onSubmit={handleCreateGroup} className="stack">
          <input
            type="text"
            placeholder="Nom du groupe"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <button type="submit">Créer</button>
        </form>
      </div>

      <div className="card">
        <h2>Mes groupes</h2>

        {groups.length === 0 ? (
          <p>Aucun groupe</p>
        ) : (
          <ul className="list-reset stack">
            {groups.map((membership) => (
              <li key={membership.id} className="reply-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{membership.group.name}</strong>
                  </div>

                  <button
                    className="secondary"
                    onClick={() => handleLeaveGroup(membership.group.id)}
                  >
                    Quitter
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Ajouter un utilisateur à un groupe</h2>

        <div className="stack" style={{ marginBottom: "1rem" }}>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            <option value="">Choisir un groupe</option>
            {groups.map((membership) => (
              <option key={membership.group.id} value={membership.group.id}>
                {membership.group.name}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchUsers} className="stack">
            <input
              type="text"
              placeholder="Rechercher un utilisateur"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Rechercher</button>
          </form>
        </div>

        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <ul className="list-reset stack">
            {users.map((user) => (
              <li key={user.id} className="reply-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{user.username}</strong>
                    <div className="meta">{user.email}</div>
                  </div>

                  <button onClick={() => handleAddUser(user.id)}>Ajouter</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GroupsPage;