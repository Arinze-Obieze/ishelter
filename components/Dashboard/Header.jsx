import { FaHome, FaVideo, FaFileAlt, FaCreditCard, FaRegCommentDots, FaBell, FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <div>
      <header className="bg-white place-items-center flex items-center justify-between px-6 py-2 md:mt-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-bold text-2xl text-primary tracking-wide">i</span>
          <span className="font-bold text-2xl ml-0.5">SHELTER</span>
        </div>
  
        {/* Navigation */}
        <nav className="flex items-center gap-8 text-xs">
          <a href="#" className="flex items-center text-primary font-medium">
            <FaHome className="mr-1 text-base" />
            Dashboard
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-primary">
            <FaVideo className="mr-1 text-base" />
            Live Feed
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-primary">
            <FaFileAlt className="mr-1 text-base" />
            Documents
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-primary">
            <FaCreditCard className="mr-1 text-base" />
            Billing
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-primary">
            <FaRegCommentDots className="mr-1 text-base" />
            Chat
          </a>
        </nav>
  
        {/* Notification & Profile */}
        <div className="flex items-center gap-4">
          <button>
            <FaBell className="text-xl text-gray-700 hover:text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 rounded-full p-2">
              <FaUser className="text-md text-gray-500" />
            </span>
            <span className="text-gray-700 font-medium">John Smith</span>
          </div>
        </div>
      </header>
    
    <div className='bg-[#FDF2E5] w-full text-center py-3'>
      <h1 className='text-[#F07D00] text-base font-semibold'>iSHELTER is a product of Everything Shelter</h1>
    </div>
      </div>
  )
}

export default Header
