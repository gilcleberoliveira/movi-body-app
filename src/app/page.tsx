import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function LandingPage() {
  return (
    <div className="frame view-landing">
      <div className="landing-wrap">
        <header className="landing-header">
          <Brand />
        </header>
        <Image className="landing-watermark" src="/logo.png" alt="" width={520} height={520} aria-hidden />
        <main className="landing-main">
          <h1>Get ready to create a new identity.</h1>
          <p>Transform your life through consistent action. Stop consuming motivation. Start becoming.</p>
        </main>
        <div className="landing-cta">
          <Link href="/signup" className="pill primary landing-btn">
            Start your journey
          </Link>
          <p className="landing-foot">Join thousands transforming their identity through sport.</p>
        </div>
      </div>
    </div>
  );
}
