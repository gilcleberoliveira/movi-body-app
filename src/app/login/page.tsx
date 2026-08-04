"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { signIn } from "@/app/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="frame view-login">
      <div className="login-wrap">
        <header className="landing-header">
          <Brand />
        </header>
        <main className="login-main">
          <h1>Welcome</h1>
          <p className="login-sub">Sign in to keep your streak alive.</p>

          <form action={formAction} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="login-field">
              <div className="login-field-head">
                <label htmlFor="password">Password</label>
              </div>
              <input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="pill primary login-btn" disabled={pending}>
              {pending ? "Signing in…" : "Continue"}
            </button>
            {state?.error && <p className="form-error">{state.error}</p>}
          </form>

          <p className="login-foot">
            New here? <Link href="/signup">Start your journey</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
