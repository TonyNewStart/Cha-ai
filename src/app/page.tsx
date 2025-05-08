"use client";

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import ChatWidget from '@/components/ChatWidget';

export default function ChatPage() {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<Session | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // If no session, show login form
  if (!session) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="p-4 border rounded max-w-sm w-full">
          <h2 className="mb-2 text-lg font-semibold">Sign in with Email</h2>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-2 py-1 mb-2"
          />
          <button
            className="w-full bg-blue-600 text-white py-1 rounded"
            onClick={() => supabase.auth.signInWithOtp({ email })}
          >
            Send Sign‑In Link
          </button>
        </div>
      </main>
    );
  }

  // Once signed in, render the chat widget
  return (
    <main className="flex items-center justify-center min-h-screen">
      <ChatWidget />
    </main>
  );
}