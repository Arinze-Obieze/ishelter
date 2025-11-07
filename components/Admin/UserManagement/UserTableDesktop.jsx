import UserRow from "@/components/Admin/UserManagement/UserRow"

const UserTableDesktop = ({ users, onEdit, onDelete }) => {
  return (
    <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">User Name</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Email Address</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Role</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Last Login</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Registered Date</th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow 
              key={user.id} 
              user={user} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTableDesktop