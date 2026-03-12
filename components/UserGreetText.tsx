"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Sparkles } from "lucide-react";

const UserGreetText = () => {
  const [user, setUser] = useState<User | null>(null);
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

  if (user !== null) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-400/5 dark:via-blue-400/5 dark:to-purple-400/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 dark:border-white/10 shadow-lg">
        <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Welcome back,&nbsp;
          <span className="font-semibold text-slate-900 dark:text-white">
            {user.user_metadata.full_name ?? "User"}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-400/5 dark:via-blue-400/5 dark:to-purple-400/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 dark:border-white/10 shadow-lg">
      <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Get your dream house with AI-powered architecture
      </span>
    </div>
  );
};

export default UserGreetText;
