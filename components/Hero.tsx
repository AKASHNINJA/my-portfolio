"use client";

import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div
        aria-hidden
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl animate-blob"
      />
      <div
        aria-hidden
        className="absolute top-32 -right-24 h-96 w-96 rounded-full bg-fuchsia-300/30 blur-3xl animate-blob"
      />

      <div className="relative section pt-32 pb-20 sm:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          Hi there, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 text-5xl sm:text-7xl font-bold tracking-tight"
        >
          {profile.name}.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-slate-500 dark:text-slate-400"
        >
          {profile.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a href="#projects" className="btn-primary">
            View my work <ArrowRight size={16} />
          </a>
          <a href="#contact" className="btn-ghost">
            Get in touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center gap-5 text-slate-500 dark:text-slate-400"
        >
          <a
            href={profile.socials.github}
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href={profile.socials.linkedin}
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Mail size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
