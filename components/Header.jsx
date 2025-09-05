'use client'
import React, { useState } from 'react'
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className='flex justify-between md:mx-12 mx-4 mt-4'>
        {/* logo with text  */}
        <div className='flex place-items-center space-x-2 '>
          <img src='/logo.svg' alt='logo' className='md:w-8 md:h-8 w-4 h-4'/>
          <h1 className='md:text-2xl text-lg font-bold md:mt-2'>iSHELTER</h1>
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <div className=' place-items-center space-x-12 md:flex hidden'>
          <nav className='space-x-8'>
            <a href='/' className='text-xl text-secondary hover:text-primary'>Home</a>
            <a href='#' className='text-xl text-secondary hover:text-primary'>Service</a>
            <a href='#' className='text-xl text-secondary hover:text-primary'>About Us</a>
            <a href='#' className='text-xl text-secondary hover:text-primary'>Testimonials</a>
            <a href='#' className='text-xl text-secondary hover:text-primary'>Contact</a>
          </nav>
          <button className='bg-primary text-white py-2 px-4 rounded'>Request a Free Consultation</button>
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
              <button className='w-full justify-center'>Get Started</button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header