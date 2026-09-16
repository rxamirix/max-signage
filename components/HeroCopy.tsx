"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { MaxWordmark } from "./MaxWordmark";

export function HeroCopy() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 select-none sm:px-6">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col items-center gap-5 text-center sm:gap-6 md:translate-y-[18vh] md:gap-8">
        <motion.p
          className="text-2xl font-extrabold tracking-wide text-brand-yellow sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          تابلوسازی مکث
        </motion.p>

        <motion.h1
          className="text-brand-white"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <MaxWordmark
            className="mx-auto h-auto w-[min(82vw,20rem)] text-brand-white sm:w-[min(78vw,28rem)] md:w-[min(80.8vw,49.2rem)] lg:w-[min(68.9vw,55.1rem)]"
            forSeeClassName="fill-brand-yellow"
          />
          <span className="sr-only">
            {site.motto} — {site.name}. {site.brandPromise}
          </span>
        </motion.h1>

        <motion.a
          href="/contact#quote"
          className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-yellow px-7 py-3 text-[0.95rem] font-bold text-navy-950 shadow-[0_14px_40px_rgba(234,234,53,0.32)] sm:gap-3 sm:px-8 sm:py-3.5 sm:text-base md:px-10 md:py-4 md:text-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-4 top-0 h-px rounded-full bg-white/55"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-full bg-gradient-to-l from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:-translate-x-full"
          />
          <span className="relative">استعلام رایگان</span>
          <svg
            viewBox="0 0 20 20"
            className="relative size-4 transition-transform duration-300 group-hover:-translate-x-1 sm:size-5"
            aria-hidden="true"
          >
            <path
              d="M12 4 6 10l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
