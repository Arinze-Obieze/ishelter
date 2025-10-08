import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { useProjectUsers } from "@/contexts/ProjectUsersContext";

export default function ProjectUserSearchBox({ selectedUsers, setSelectedUsers, disabled }) {
  const { users, loading, error } = useProjectUsers();
  const [search, setSearch] = useState("");

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter(u =>
      (u.displayName || u.name || u.email || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const handleSelect = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Add Users to Project</label>
      <div className="relative mb-2">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
          placeholder="Search users by name or email"
          disabled={disabled || loading}
        />
      </div>
      {loading && <div className="text-gray-500 text-sm">Loading users...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="max-h-40 overflow-y-auto border rounded-lg bg-white divide-y divide-gray-100">
        {filteredUsers.length === 0 && !loading && (
          <div className="p-3 text-gray-500 text-sm">No users found</div>
        )}
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="flex items-center justify-between px-3 py-2 hover:bg-orange-50 cursor-pointer"
            onClick={() => handleSelect(user)}
          >
            <span className="text-sm text-gray-900">{user.displayName || user.name || user.email}</span>
            <span className="text-xs text-gray-500">{user.id}</span>
          </div>
        ))}
      </div>
      {selectedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedUsers.map(user => (
            <span key={user.id} className="inline-flex items-center bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              {user.displayName || user.name || user.email}
              <button
                type="button"
                className="ml-1 text-orange-500 hover:text-orange-700"
                onClick={() => handleRemove(user.id)}
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
