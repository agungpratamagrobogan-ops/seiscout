"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { NetworkBadge } from "@/components/network-badge"

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analysis", label: "Analysis" },
    { href: "/opportunities", label: "Opportunities" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0C101A]/95 backdrop-blur-md border-b border-[#1A202C]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#22D3EE] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#0C101A]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#22D3EE]">SeiScout</span>
              <span className="text-xs text-gray-400 -mt-1">AI Wallet Radar</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href ? "text-[#22D3EE]" : "text-[#F7FAFC] hover:text-[#22D3EE]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <NetworkBadge />
            <WalletConnectButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0C101A] border-[#1A202C]">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg transition-colors ${
                      pathname === item.href ? "text-[#22D3EE]" : "text-[#F7FAFC] hover:text-[#22D3EE]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-8 space-y-4">
                  <NetworkBadge />
                  <WalletConnectButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
