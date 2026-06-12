'use client';

import { Link } from "@heroui/react";

const Footer = () => {
  return (
    <footer className="border-t border-separator bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">JobBoard</h2>
            <p className="mt-3 text-sm text-default-500">
              Connecting talented professionals with amazing opportunities.
              Find your dream job and grow your career.
            </p>
          </div>

          {/* Jobs */}
          <div>
            <h3 className="font-semibold mb-4">Jobs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">Browse Jobs</Link>
              </li>
              <li>
                <Link href="#">Remote Jobs</Link>
              </li>
              <li>
                <Link href="#">Featured Jobs</Link>
              </li>
              <li>
                <Link href="#">Internships</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Careers</Link>
              </li>
              <li>
                <Link href="#">Blog</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
              <li>
                <Link href="#">Cookie Policy</Link>
              </li>
              <li>
                <Link href="#">Help Center</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-separator" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-default-500">

          <p suppressHydrationWarning>
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#">Twitter</Link>
            <Link href="#">LinkedIn</Link>
            <Link href="#">GitHub</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;