"use client";

import { motion } from "framer-motion";
import { skills, type Skill } from "@/lib/data";

const categories: Skill["category"][] = ["Frontend", "Backend", "AI/ML", "Tools"];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">Skills</span>
        <h2 className="section-title mt-2">Tools I use day to day</h2>
      </motion.div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{cat}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <li
                    key={s.name}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 py-1 text-sm text-slate-700 dark:text-slate-200"
                  >
                    {s.name}
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
