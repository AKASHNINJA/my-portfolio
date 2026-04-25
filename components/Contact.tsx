"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import { profile } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="section text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">Contact</span>
        <h2 className="section-title mt-2">Let&apos;s build something together</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          I&apos;m always open to interesting projects, collaborations, or just a friendly hello.
          The fastest way to reach me is email.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            <Mail size={16} /> {profile.email}
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}
