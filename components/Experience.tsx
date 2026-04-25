"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">Experience</span>
        <h2 className="section-title mt-2">Where I&apos;ve worked</h2>
      </motion.div>

      <ol className="mt-10 relative border-l border-slate-200 dark:border-slate-800 ml-3">
        {experience.map((e, idx) => (
          <motion.li
            key={`${e.company}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="ml-6 mb-10"
          >
            <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-950" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {e.role} <span className="text-slate-500 font-normal">@ {e.company}</span>
              </h3>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                {e.period}
              </span>
            </div>
            <ul className="mt-3 list-disc list-outside ml-5 space-y-1.5 text-slate-600 dark:text-slate-300">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
