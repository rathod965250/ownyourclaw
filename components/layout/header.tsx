"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function Header({ user }: { user?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full transition-all duration-300 ease-in-out px-4 md:px-6 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-extrabold text-xl md:text-2xl tracking-tighter text-foreground lowercase">
            ownyour<span className="text-primary">claw</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
          <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/#integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Integrations</Link>
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-border/50 bg-background text-foreground hover:bg-muted")}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/50 p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6 font-medium">
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">How it works</Link>
            <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/#integrations" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Integrations</Link>
            <hr className="border-border/50" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Login</Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-center font-bold font-sans"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
