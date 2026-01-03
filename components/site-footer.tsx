"use client"

import TunnlLogo from "./tunnl-logo"
import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-800 py-6 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TunnlLogo />
          <span className="text-xl font-bold">
            <span className="text-emerald-400">tunnl</span>.live
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4 text-sm">
          <Link href="https://status.fossy.my.id/status/services" className="text-gray-400 hover:text-emerald-400 transition-colors">
            Status Page
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} tunnl.live. Made with ❤️ by{' '}
          <a
            href="https://github.com/fossyy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Bagas
          </a>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
