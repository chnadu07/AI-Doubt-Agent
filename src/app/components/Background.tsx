"use client";

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid */}
      <div className="bg-grid absolute inset-0 opacity-100" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, #050816 100%)",
        }}
      />

      {/* Orb 1 - Blue */}
      <div
        className="orb-1 absolute"
        style={{
          width: 700,
          height: 700,
          top: "-200px",
          left: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 2 - Violet */}
      <div
        className="orb-2 absolute"
        style={{
          width: 600,
          height: 600,
          bottom: "-100px",
          right: "5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Orb 3 - Indigo center */}
      <div
        className="orb-3 absolute"
        style={{
          width: 500,
          height: 500,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: 900,
          height: 300,
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
