"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">Projects</span>
        <h2 className="section-title mt-2">Things I&apos;ve built</h2>
      </motion.div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {projects.map((p, idx) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="card group p-6 flex flex-col"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {p.title}
                {p.featured && (
                  <span className="ml-2 align-middle rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                    Featured
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-slate-400">
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title} GitHub repository`}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Github size={18} />
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title} live site`}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>

            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
              {p.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-600 dark:text-slate-300"
                >
                  {t}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
