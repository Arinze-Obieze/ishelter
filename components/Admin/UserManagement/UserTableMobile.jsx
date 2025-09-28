import UserCard from "@/components/Admin/UserManagement/UserCard"

const UserTableMobile = ({ users }) => {
  return (
    <div className="block lg:hidden space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

export default UserTableMobile
