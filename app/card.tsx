"use client"
    
import { useState } from "react"

export default function Card() {
    const [copied, setCopied] = useState(false)
    const command = "ssh tunnl.live -p 2200 -R 443:localhost:8000"

    const copyToClipboard = () => {
        navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Connect with a single command</h2>
            <div className="relative">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 font-mono text-sm sm:text-base overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all sm:break-normal">{command}</pre>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="absolute right-3 top-3 h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
                    aria-label="Copy command"
                >
                    {copied ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-emerald-400"
                        >
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="mt-4 text-sm text-gray-400">
                This command creates a secure tunnel from our server to your localhost:8000
            </p>
        </div>
    )
}