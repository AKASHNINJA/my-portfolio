"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { about } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">About</span>
        <h2 className="section-title mt-2">A bit about me</h2>
      </motion.div>

      <div className="mt-10 grid md:grid-cols-5 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="md:col-span-3 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-2 space-y-3"
        >
          {about.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <Check size={12} />
              </span>
              <span className="text-slate-700 dark:text-slate-200">{h}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
