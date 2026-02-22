import { getUser } from "@/actions/get-user";
import GoogleSignIn from "@/components/auth/google-signin";
import Header from "@/components/layout/header";
import TailwindBadge from "@/components/ui/tailwind-badge";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";

export default async function Page(props: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const userRes = await getUser();
  const { error } = await props.searchParams;

  if (userRes.success && userRes.data) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
      <Header user={null} />
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-md w-full pt-20 text-center">
        <div className="mt-10 bg-card border border-border/50 p-8 md:p-10 rounded-lg shadow-xl flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tighter lowercase italic">Welcome Back</h1>
          <p className="text-muted-foreground mb-10 lowercase italic">Sign in to manage your AI claw.</p>

          {error && (
            <div className="w-full mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 text-left">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="w-full flex justify-center">
            <GoogleSignIn />
          </div>

          <div className="mt-8 flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
            <span className="h-[1px] w-8 bg-border"></span>
            <span>Secure Access</span>
            <span className="h-[1px] w-8 bg-border"></span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground lowercase italic">
          Don't have an account? <br />
          <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
