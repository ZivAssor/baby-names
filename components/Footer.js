import React from 'react';
import { FaLinkedin,FaFacebookSquare, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-gray-800 bg-gray-100 py-4">
      <div className="container mx-auto text-center">
        <div>
          <h1 className="font-semibold">
            © 2023 All rights reserved | Built with ❤ by{' '}
            <a
              href="https://www.linkedin.com/in/ziv-assor/"
              className="hover:underline hover:cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ziv Assor
            </a>
          </h1>
        </div>
        <div className="flex justify-center gap-6 py-5">
          <a
                      href="https://www.linkedin.com/in/ziv-assor-026012141/" 
                      target="_blank" 
                      rel="noopener noreferrer">              
          <FaLinkedin className="text-2xl cursor-pointer hover:text-blue-800" />
          </a>
          <a
                      href="https://www.facebook.com/ziv.assor" 
                      target="_blank" 
                      rel="noopener noreferrer">    
          <FaFacebookSquare className="text-2xl cursor-pointer hover:text-blue-600" />
          </a>
          <a
                      href="https://www.instagram.com/ziv_assor/" 
                      target="_blank" 
                      rel="noopener noreferrer">    
          <FaInstagram className="text-2xl cursor-pointer hover:text-purple-500" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;