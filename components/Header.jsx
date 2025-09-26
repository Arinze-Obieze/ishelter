'use client'
import React, { useState } from 'react'
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Link from 'next/link'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Service", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Testimonials", href: "#" },
    { name: "Contact", href: "#" }
    ];

  return (
    <>
      <div className='flex justify-between md:mt-5 md:mx-12 mx-4 mt-4'>
        {/* logo with text  */}
        <div className='flex place-items-center '>
          {/* <img src='/logo.svg' alt='logo' className='md:w-8 md:h-8 w-4 h-4'/> */}
          <span className="text-primary font-bold text-xl">i</span>
          <span className="text-black font-bold text-xl">SHELTER</span>
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <div className=' place-items-center space-x-12 md:flex hidden'>
          <nav className='space-x-8'>
          {navLinks.map((link, index) => (
          <a 
            key={index} 
            href={link.href} 
            className='text-base text-secondary hover:text-primary'
          >
            {link.name}
          </a>
        ))}
      </nav>
<Link href='/consultation'>          <button className='bg-primary cursor-pointer text-white py-2 px-4 rounded'>Request Consultation</button>
</Link>
        </div>

        {/* Mobile menu button - visible only on small screens */}
        <div className='md:hidden flex items-center'>
          <button 
            onClick={toggleMenu}
            className='text-secondary focus:outline-none'
            aria-label='Toggle menu'
          >
            {/* Hamburger icon */}
            <div className="w-6 h-6">
              {isMenuOpen ? (
                <IoMdClose />
              ) : (
                <RiMenu3Fill />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu - appears when hamburger icon is clicked */}
      {isMenuOpen && (
        <div className='md:hidden bg-white shadow-lg py-4 px-6 absolute w-full z-10'>
          <nav className='flex flex-col space-y-4'>
            <a href='#' className='text-lg text-secondary hover:text-primary py-2'>Home</a>
            <a href='#' className='text-lg text-secondary hover:text-primary py-2'>Services</a>
            <a href='#' className='text-lg text-secondary hover:text-primary py-2'>About Us</a>
            <a href='#' className='text-lg text-secondary hover:text-primary py-2'>Testimonials</a>
            <a href='#' className='text-lg text-secondary hover:text-primary py-2'>Contact</a>
            <div className='pt-2'>
              <button className='w-full justify-center'>Request Consultation</button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header