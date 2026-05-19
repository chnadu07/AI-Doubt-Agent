"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#020205] text-white overflow-hidden select-none">
      
      {/* 1. Cinematic Background Grid & Glowing Orbs */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(6, 182, 212, 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      
      {/* Vignette Shadow Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020205_100%)] pointer-events-none" />

      {/* Floating Ambient Glowing Orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* HUD Scanner Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-5">
        <motion.div 
          className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
          animate={{ y: ["-10%", "110%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Technical HUD Text Elements */}
      <div className="absolute top-8 left-8 hidden md:flex flex-col gap-1 font-mono text-[9px] text-cyan-500/40 uppercase tracking-widest z-10">
        <span>[ System: Active ]</span>
        <span>[ Core: BlackEye AI v2.5 ]</span>
        <span>[ Link: Supabase DB pooler ]</span>
      </div>
      <div className="absolute top-8 right-8 hidden md:flex flex-col gap-1 font-mono text-[9px] text-cyan-500/40 uppercase tracking-widest text-right z-10">
        <span>[ Latency: 12ms ]</span>
        <span>[ Core_Temp: 34°C ]</span>
        <span>[ Status: Booting Engine ]</span>
      </div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        
        {/* 2. Animated AI Eye Centerpiece */}
        <motion.div
          className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80"
          animate={{
            y: [-6, 6, -6],
            rotate: [0, 0.5, -0.5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Cyan Blur Behind Eye */}
          <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Outer Pulsing Glow Shell */}
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-500/10 shadow-[0_0_60px_rgba(6,182,212,0.05)] bg-cyan-950/5 backdrop-blur-[3px]"
            animate={{
              scale: [0.96, 1.04, 0.96],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Concentric HUD Rings */}
          
          {/* Ring 1: Tech notched outer ring */}
          <div className="absolute w-[95%] h-[95%] rounded-full border border-cyan-500/20 border-t-transparent border-b-transparent animate-[spin_10s_linear_infinite]" />
          
          {/* Ring 2: Glassmorphic cyber ring */}
          <motion.div 
            className="absolute w-[80%] h-[80%] rounded-full border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center"
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Ring 3: Rotating Dashed Ring (Clockwise) */}
            <motion.div 
              className="absolute w-[85%] h-[85%] rounded-full border-2 border-dashed border-cyan-400/50"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Ring 4: Reverse Rotating Dashed Ring (Counter-Clockwise) */}
            <motion.div 
              className="absolute w-[70%] h-[70%] rounded-full border border-dashed border-cyan-500/30"
              animate={{ rotate: -360 }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Ring 5: Inner Solid Ring with HUD tick accents */}
            <div className="absolute w-[55%] h-[55%] rounded-full border border-cyan-300/40 flex items-center justify-center">
              
              {/* Ring 6: Glowing Pupil & Core */}
              <motion.div 
                className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.7)]"
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  boxShadow: [
                    "0 0 30px rgba(34,211,238,0.5)",
                    "0 0 50px rgba(34,211,238,0.8)",
                    "0 0 30px rgba(34,211,238,0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Hyper-white core center of pupil */}
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                </div>

                {/* Cyber Scanner dot reflecting on pupil */}
                <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-cyan-200/60 blur-[0.5px]" />
              </motion.div>

              {/* Concentric expanding ripples (Expanding wave pulses) */}
              <motion.div 
                className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-cyan-400 pointer-events-none"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div 
                className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-emerald-400 pointer-events-none"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

            </div>
          </motion.div>

          {/* Subtle Outer Angle brackets to reinforce HUD aesthetic */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40 rounded-br-sm" />
        </motion.div>

        {/* 3. Branding Section */}
        <div className="mt-8 flex flex-col items-center text-center">
          
          {/* Main futuristic brand text with tracked premium letter spacing */}
          <motion.h1
            className="text-4xl md:text-5xl font-black tracking-[0.45em] bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] select-none uppercase font-sans pl-[0.45em]"
            animate={{
              opacity: [0.75, 1, 0.75],
              filter: ["brightness(0.95)", "brightness(1.1)", "brightness(0.95)"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            BLACKEYE
          </motion.h1>

          {/* Subtitle animating with breathing opacity effect */}
          <motion.p
            className="mt-3 text-xs md:text-sm font-mono tracking-[0.25em] text-cyan-400/60 uppercase"
            animate={{
              opacity: [0.35, 0.85, 0.35],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Initializing AI Engine...
          </motion.p>
        </div>

        {/* 4. Sleek Loading Progress Bar */}
        <div className="relative mt-8 w-56 md:w-72 h-[3px] bg-cyan-950/60 rounded-full overflow-hidden border border-cyan-500/25 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <motion.div
            className="absolute top-0 left-0 h-full w-[40%] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.9)]"
            animate={{
              left: ["-40%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Bottom Small Sci-fi Footer Coordinates */}
        <div className="mt-16 font-mono text-[8px] text-cyan-500/30 uppercase tracking-[0.3em] flex gap-4 select-none">
          <span>LAT: 47.6062° N</span>
          <span>•</span>
          <span>LON: 122.3321° W</span>
          <span>•</span>
          <span>SEC: {Math.floor(Date.now() / 1000) % 100000}</span>
        </div>

      </div>
    </div>
  );
}
