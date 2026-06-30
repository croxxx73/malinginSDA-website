import { useState } from "react";
import { motion } from "motion/react";
import adventistLogo from "../../imports/adventist_logo.webp";

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<"idle" | "opening">("idle");

  const handleTap = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(onComplete, 1900);
  };

  const doorVariants = {
    closed: { rotateY: 0 },
    open: { rotateY: 80, transition: { duration: 1.35, ease: [0.76, 0, 0.24, 1] as const, delay: 0.08 } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] cursor-pointer overflow-hidden select-none"
      onClick={handleTap}
      animate={phase === "opening" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.45, delay: 1.55 }}
    >
      {/* Sky / background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #08111e 0%, #0d1a2e 50%, #111f35 100%)" }} />

      {/* SDA logo silhouette behind door */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={adventistLogo}
          alt=""
          style={{
            width: "clamp(130px, 38vw, 240px)",
            height: "auto",
            opacity: 0.18,
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* Subtle light bloom at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-28 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(200,160,80,0.08), transparent 70%)" }}
      />

      {/* ─── LEFT DOOR PANEL ─── */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ transformOrigin: "0% 50%", transformStyle: "preserve-3d", perspective: "1200px" }}
        variants={doorVariants}
        initial="closed"
        animate={phase === "opening" ? "open" : "closed"}
      >
        <DoorPanel side="left" />
      </motion.div>

      {/* ─── RIGHT DOOR PANEL ─── */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ transformOrigin: "100% 50%", transformStyle: "preserve-3d", perspective: "1200px" }}
        variants={{
          closed: { rotateY: 0 },
          open: { rotateY: -80, transition: { duration: 1.35, ease: [0.76, 0, 0.24, 1] as const, delay: 0.08 } },
        }}
        initial="closed"
        animate={phase === "opening" ? "open" : "closed"}
      >
        <DoorPanel side="right" />
      </motion.div>

      {/* Door frame edges */}
      <div className="absolute inset-x-0 top-0 h-3 bg-[#07090d] z-10" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#07090d] z-10" />
      <div className="absolute inset-y-0 left-0 w-3 bg-[#07090d] z-10" />
      <div className="absolute inset-y-0 right-0 w-3 bg-[#07090d] z-10" />

      {/* Center seam */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-px w-0.5 bg-[#07090d] z-10" />

      {/* ─── TEXT OVERLAY ─── */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 pointer-events-none"
        animate={phase === "opening" ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.55, ease: "easeOut" }}
        >
          <p
            className="text-white drop-shadow-lg"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1.9rem, 5.5vw, 4rem)",
              lineHeight: 1.25,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            Welcome to Malingin
          </p>
          <p
            className="text-white drop-shadow-lg"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              lineHeight: 1.3,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            SDA Church
          </p>
        </motion.div>

        <motion.div
          className="my-5 h-px bg-white/20"
          style={{ width: 0 }}
          initial={{ width: 0 }}
          animate={{ width: 72 }}
          transition={{ duration: 0.9, delay: 1.5 }}
        />

        <motion.p
          className="text-white/40 uppercase font-[Lato] tracking-[0.24em]"
          style={{ fontSize: "10px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.8 }}
        >
          Tap anywhere to continue
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const gradient = isLeft
    ? "linear-gradient(to right, #130803 0%, #311508 30%, #4a2010 65%, #3a1a0c 100%)"
    : "linear-gradient(to left, #130803 0%, #311508 30%, #4a2010 65%, #3a1a0c 100%)";
  const edgeShadowGradient = isLeft
    ? "linear-gradient(to left, rgba(0,0,0,0.75), transparent)"
    : "linear-gradient(to right, rgba(0,0,0,0.75), transparent)";
  const edgeSide = isLeft ? "right" : "left";

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: gradient }}>
      {/* Wood grain lines */}
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            [isLeft ? "left" : "right"]: `${12 + i * 13}%`,
            width: "1px",
            background: "linear-gradient(to bottom, transparent 0%, rgba(180,100,40,0.12) 20%, rgba(180,100,40,0.12) 80%, transparent 100%)",
          }}
        />
      ))}

      {/* Top panel recess */}
      <div
        className="absolute"
        style={{
          top: "7%", left: "9%", right: "9%", height: "24%",
          border: "1.5px solid rgba(160,90,35,0.3)",
          borderRadius: "3px",
          background: "rgba(10,4,1,0.4)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute inset-2.5 rounded-sm" style={{ border: "1px solid rgba(160,90,35,0.12)" }} />
      </div>

      {/* Middle panel recess */}
      <div
        className="absolute"
        style={{
          top: "36%", left: "9%", right: "9%", height: "13%",
          border: "1.5px solid rgba(160,90,35,0.3)",
          borderRadius: "3px",
          background: "rgba(10,4,1,0.35)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.35)",
        }}
      />

      {/* Bottom panel recess */}
      <div
        className="absolute"
        style={{
          top: "54%", left: "9%", right: "9%", bottom: "7%",
          border: "1.5px solid rgba(160,90,35,0.3)",
          borderRadius: "3px",
          background: "rgba(10,4,1,0.4)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute inset-2.5 rounded-sm" style={{ border: "1px solid rgba(160,90,35,0.12)" }} />
      </div>

      {/* Door handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
        style={{ [edgeSide]: "10px" }}
      >
        <div
          className="w-2.5 h-7 rounded-full"
          style={{ background: "linear-gradient(to bottom, #e8cc70 0%, #a07830 40%, #c4a050 60%, #e8cc70 100%)", boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "radial-gradient(circle, #e8cc70, #9a6820)", marginTop: 2 }}
        />
      </div>

      {/* Edge shadow (facing the seam) */}
      <div
        className="absolute inset-y-0 w-10"
        style={{ [edgeSide]: 0, background: edgeShadowGradient }}
      />
    </div>
  );
}
