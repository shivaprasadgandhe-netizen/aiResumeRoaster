"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Flame, LayoutDashboard, Menu, X, LogIn, LogOut, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-flame-600 to-amber-500 flex items-center justify-center shadow-lg shadow-flame-500/20 group-hover:scale-105 transition-all">
            <Flame className="w-6 h-6 text-white animate-flame-flicker" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              Resume<span className="text-flame-500">Roaster</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-flame-500/10 text-flame-600 dark:text-flame-400 px-1.5 py-0.5 rounded border border-flame-500/20">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/")
                ? "text-flame-600 dark:text-flame-400 font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            Roaster
          </Link>

          <Link
            href="/dashboard"
            className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
              isActive("/dashboard")
                ? "text-flame-600 dark:text-flame-400 font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        {/* Right side controls: Theme toggle + Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="w-20 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={28}
                    height={28}
                    className="rounded-full ring-1 ring-flame-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-flame-500/20 text-flame-600 font-bold flex items-center justify-center text-xs">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0] || "User"}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-flame-500 hover:bg-flame-600 text-white text-sm font-semibold shadow-md shadow-flame-500/25 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-charcoal-900 px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-flame-500/10 text-flame-600 dark:text-flame-400 font-bold"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-flame-500" />
            Resume Roaster
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-flame-500/10 text-flame-600 dark:text-flame-400 font-bold"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-flame-500" />
            My Dashboard
          </Link>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            {session?.user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full ring-1 ring-flame-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-flame-500/20 text-flame-600 font-bold flex items-center justify-center text-sm">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {session.user.name || "Candidate"}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate max-w-[180px]">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="px-2.5 py-1 text-xs text-red-500 border border-red-500/30 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-flame-500 hover:bg-flame-600 text-white text-sm font-semibold shadow-md shadow-flame-500/25"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
