import { FiSearch } from "react-icons/fi"

const SearchBar = ({ value, onChange, placeholder = "Search users..." }) => {
  return (
    <div className="relative mb-4">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  )
}

export default SearchBar