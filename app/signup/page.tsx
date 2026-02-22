import { getUser } from "@/actions/get-user";
import GoogleSignIn from "@/components/auth/google-signin";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Zap, CheckCircle } from "lucide-react";
import Header from "@/components/layout/header";

export default async function SignupPage(props: {
    searchParams: Promise<{
        error?: string;
        plan?: string;
    }>;
}) {
    const userRes = await getUser();
    const { error, plan } = await props.searchParams;

    if (userRes.success && userRes.data) {
        redirect("/dashboard" + (plan ? `?plan=${plan}` : ""));
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
            <Header user={null} />
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-md w-full pt-20">
                {/* Signup Card */}
                <div className="bg-card border border-border/50 p-8 md:p-10 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tighter lowercase italic">Get started today</h1>
                    <p className="text-muted-foreground text-center mb-10 lowercase italic">
                        {plan
                            ? `Creating your account for the ${plan} plan.`
                            : "Launch your AI agent on WhatsApp in seconds."}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                            <span className="mt-0.5">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 items-center">
                        <GoogleSignIn />

                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                            <span className="h-[1px] w-8 bg-border"></span>
                            <span>Secure OAuth 2.0</span>
                            <span className="h-[1px] w-8 bg-border"></span>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium lowercase">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>Full privacy access for WhatsApp</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium lowercase">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>Connect 20+ integrations instantly</span>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground lowercase italic">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
