'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Error Card */}
        <div className="relative backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-emerald-500/50 dark:border-emerald-400/50 rounded-full"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-blue-500/50 dark:border-blue-400/50 rounded-full"></div>

          {/* Error Icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              Something went wrong
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              We&apos;re sorry, but something unexpected happened. Don&apos;t
              worry, your data is safe.
            </p>

            {/* Error Details (optional) */}
            {error && process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <details className="text-sm text-slate-500 dark:text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
                    Technical Details
                  </summary>
                  <pre className="mt-2 overflow-auto max-h-32 text-xs">
                    {error.message}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={() => {
                  // Try to go back to the previous page
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    // Fallback to home page if no previous page
                    window.location.href = '/';
                  }
                }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Try Again
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Link href="/">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Support Info */}
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-50"></div>
        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-50 delay-700"></div>
      </div>
    </div>
  );
}