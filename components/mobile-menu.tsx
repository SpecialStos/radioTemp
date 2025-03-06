"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  return (
    <>
      <button onClick={toggleMenu} className="md:hidden text-white hover:text-primary transition-colors">
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" className="text-2xl font-bold neon-text" onClick={toggleMenu}>
              disclosure.cy
            </Link>
            <button onClick={toggleMenu} className="text-white hover:text-primary transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col p-4">
            <Link href="/?scroll=videos" onClick={toggleMenu} scroll={false}>
              <div className="py-4 border-b border-border text-white">Library</div>
            </Link>
            <Link href="/calendar" onClick={toggleMenu}>
              <div className="py-4 border-b border-border text-white">Calendar</div>
            </Link>
            <a href="https://linktr.ee/disclosure.cy" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
              <div className="py-4 border-b border-border text-white">Social</div>
            </a>
            <Link href="/about" onClick={toggleMenu}>
              <div className="py-4 border-b border-border text-white">About</div>
            </Link>
            <Link href="/contact" onClick={toggleMenu}>
              <div className="py-4 border-b border-border text-white">Contact</div>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

