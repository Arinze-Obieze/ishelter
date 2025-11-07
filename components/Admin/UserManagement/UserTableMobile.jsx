import UserCard from "@/components/Admin/UserManagement/UserCard"

const UserTableMobile = ({ users, onEdit, onDelete }) => {
  return (
    <div className="block lg:hidden space-y-4">
      {users.map((user) => (
        <UserCard 
          key={user.id} 
          user={user} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default UserTableMobile