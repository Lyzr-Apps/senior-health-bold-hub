'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHeartbeat, FaHistory, FaShieldAlt } from 'react-icons/fa'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: FaHeartbeat },
    { href: '/history', label: 'History', icon: FaHistory },
    { href: '/admin', label: 'Admin', icon: FaShieldAlt },
  ]

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FaHeartbeat className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold text-gray-900">
              HealthNavigator AI
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
