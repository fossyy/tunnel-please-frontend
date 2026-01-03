"use client"

import Link from "next/link"
import TunnlLogo from "./tunnl-logo"
import UserMenu from "./user-menu"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client";
import { redirect, RedirectType } from 'next/navigation'

export default function SiteHeader() {
    type SessionData = Awaited<ReturnType<typeof authClient.getSession>>;
    const [logedin, setLogedin] = useState<SessionData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await authClient.getSession()
                if (result.data != null) {
                    setLogedin(result.data.user);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    redirect('/login', RedirectType.replace)
                }
            }
        })
    }
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TunnlLogo />
                        <span className="text-xl font-bold">
                            <span className="text-emerald-400">tunnl</span>.live
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {logedin ? (
                            <UserMenu
                                user={{
                                    name: logedin.name ?? "User",
                                    email: logedin.email ?? "",
                                    image: logedin.image ?? undefined,
                                }}
                                onSignOut={logout}
                            />
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
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
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" x2="3" y1="12" y2="12" />
                                    </svg>
                                    Sign In
                                </Link>

                                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
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
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 16v-4" />
                                        <path d="M12 8h.01" />
                                    </svg>
                                    <span>Sign in to save configurations & view history</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
