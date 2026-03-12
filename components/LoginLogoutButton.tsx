"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

const LoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-white/10 rounded-full border border-white/20 dark:border-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Welcome back</p>
          </div>
        </div>
        <Button
          onClick={() => {
            signout();
            setUser(null);
          }}
          variant="outline"
          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => {
          router.push("/login");
        }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 shadow-lg transform transition-all duration-300 hover:scale-105"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Log In
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          router.push("/signup");
        }}
        className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold py-3 px-6"
      >
        <UserIcon className="mr-2 h-4 w-4" />
        Sign Up
      </Button>
    </div>
  );
};

export default LoginButton;
