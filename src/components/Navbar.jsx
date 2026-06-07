'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link, Button } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client";

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="flex h-16 items-center justify-between px-6">

        {/* Left - Logo */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="font-bold text-xl">Logo</div>
        </div>

        {/* Center - Navigation */}
        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <li>
            <Link href="/jobs">Browse Jobs</Link>
          </li>
          <li>
            <Link href="#">Company</Link>
          </li>
        </ul>

        {/* Right - Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-900 dark:text-slate-100">Hi, {user.name || user.email}</span>
              <Button variant="light" onClick={handleSignOut} className="ml-2">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50">
                Sign In
              </Link>
              <Link href="/auth/signup" className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50">
                Sign Up
              </Link>
            </>
          )}

          <Button className="bg-white text-black">Get Started</Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link href="#" className="block py-2">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2">
                Company
              </Link>
            </li>
            {user ? (
              <li className="pt-2">
                <Button variant="light" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </li>
            ) : (
              <>
                <li className="pt-2">
                  <Link href="/auth/signin" className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-center">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="block w-full rounded-xl bg-white px-4 py-2 text-center text-black">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            <li>
              <Button className="w-full bg-white text-black">Get Started</Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;