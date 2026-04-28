"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();
  
  const scrollToForm = () => {
    const element = document.getElementById("analyze-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  const springY = useSpring(y1, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
       {/* Blurred Blue Glow - parallax */}
       <motion.div
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"
         style={{ y: y2 }}
       />

       <motion.div
         className="relative z-10 max-w-4xl mx-auto px-4 text-center"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         style={{ y: springY, opacity: springOpacity, scale }}
       >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="mb-3">
          <span className="uppercase tracking-[0.2em] text-blue-400 text-sm font-semibold">
            AI-Powered Vehicle Analysis
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-bebas leading-[0.9] tracking-tight mb-4" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          <motion.div variants={itemVariants} className="text-white block">
            KNOW WHAT YOUR
          </motion.div>
          <motion.div variants={itemVariants} className="text-white block">
            NEXT CAR IS
          </motion.div>
          <motion.div variants={itemVariants} className="text-white block underline decoration-blue-400">
            REALLY WORTH.
          </motion.div>
        </h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-6"
        >
          Don&apos;t get ripped off. Upload your car listing and let our AI engine analyze the price, predict upcoming service costs, and give you a clear buy/avoid verdict.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {[
            "₹ Accurate Price Analysis",
            "🔧 Parts & Service Breakdown",
            "✓ Clear Buy/Avoid Verdict",
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="px-3 py-[0.375rem] rounded-full bg-[#131d35] border border-[#0f1629] text-xs text-slate-300"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={scrollToForm}
            aria-label="Analyze a car, scroll to form"
            className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-[#0a0f1e] bg-white hover:bg-slate-100 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 touch-target"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center gap-2">
              Analyze a Car <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Bouncing Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ opacity: useTransform(scrollY, [0, 100], [1, 0]) }}
      >
        <motion.svg
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-500"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
