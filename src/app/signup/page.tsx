"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { signUp } from "@/app/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <div className="frame view-login">
      <div className="login-wrap">
        <header className="landing-header">
          <Brand />
        </header>
        <main className="login-main">
          <h1>Join Movi Body</h1>
          <p className="login-sub">Create your account and start day one today.</p>

          <form action={formAction} className="login-form">
            <div className="login-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Jordan Alex" required />
            </div>
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" minLength={6} required />
            </div>
            <button type="submit" className="pill primary login-btn" disabled={pending}>
              {pending ? "Creating account…" : "Start your journey"}
            </button>
            {state?.error && <p className="form-error">{state.error}</p>}
            {state?.message && <p className="sub" style={{ marginTop: 14, textAlign: "center" }}>{state.message}</p>}
          </form>

          <p className="login-foot">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
