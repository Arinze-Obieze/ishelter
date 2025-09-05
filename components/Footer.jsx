import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
  } from "react-icons/fa";
  import { FaPhoneAlt, FaClock } from "react-icons/fa";
  import { HiLocationMarker } from "react-icons/hi";
  import { MdEmail } from "react-icons/md";
  
  export default function Footer() {
    return (
      <footer className="bg-[#1f2430] text-gray-300 pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          {/* Logo + About */}
          <div>
            <div className="flex items-center mb-4">
              {/* Replace with actual logo */}
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded mr-2">
               <img src="/logo.svg" alt="ishelter-logo"/>
              </div>
              <h3 className="text-xl font-bold text-white">iSHELTER</h3>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              iSHELTER provides expert construction management services for
              Nigerians at home and abroad, ensuring peace of mind throughout your
              building journey.
            </p>
  
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
  
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute left-0 -bottom-1 w-10 h-[2px] bg-primary"></span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary">Home</a></li>
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Services</a></li>
              <li><a href="#" className="hover:text-primary">Projects</a></li>
              <li><a href="#" className="hover:text-primary">Testimonials</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
  
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              Services
              <span className="absolute left-0 -bottom-1 w-10 h-[2px] bg-primary"></span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary">Land Acquisition</a></li>
              <li><a href="#" className="hover:text-primary">Design & Approval</a></li>
              <li><a href="#" className="hover:text-primary">Construction Management</a></li>
              <li><a href="#" className="hover:text-primary">Project Monitoring</a></li>
              <li><a href="#" className="hover:text-primary">Quality Assurance</a></li>
              <li><a href="#" className="hover:text-primary">Handover Services</a></li>
            </ul>
          </div>
  
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 relative inline-block">
              Contact Us
              <span className="absolute left-0 -bottom-1 w-10 h-[2px] bg-primary"></span>
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="text-primary text-lg mt-1" />
                123 Lekki Phase 1, Lagos, Nigeria
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary text-sm" />
                +234 801 234 5678
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-primary text-lg" />
                info@ishelter.com
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-primary text-sm" />
                Mon - Fri: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2023 iSHELTER. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </footer>
    );
  }
  