import { profile } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <p>
          &copy; {year} {profile.name}. Built with Next.js & Tailwind.
        </p>
        <p className="font-mono text-xs">Designed & coded with care.</p>
      </div>
    </footer>
  );
}
