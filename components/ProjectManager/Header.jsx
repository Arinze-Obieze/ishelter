import { FaBell, FaBars } from 'react-icons/fa';
import Image from 'next/image';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-gray-100 h-fit  border-gray-300 px-4 md:px-8 w-full pb-4 pt-5 flex items-center justify-between">
      {/* Left: Menu Icon + Logo */}
      <div className="flex items-center gap-3">
     
        {/* Logo */}
        {/* <div className="flex items-center ">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            <span className="text-primary font-bold">i</span>SHELTER
          </span>
        </div> */}
      </div>
   
      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell className="text-2xl text-gray-600" />
          {/* <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
            3
          </span> */}
        </div>

           {/* Hamburger for mobile */}
           <button
          className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>
      </div>

    </header>
  );
}
