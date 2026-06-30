import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Facebook, Users, Sparkles } from "lucide-react";
import { FadeUp } from "./FadeUp";
import maayoPic from "../../imports/MaAYO_pic.jpg";
import alphaPic from "../../imports/alpha.jpg";
import lorlenPic from "../../imports/lorlenyouth.jpg";
import chammyPic from "../../imports/chammyyouth.jpg";
import amicusPic from "../../imports/amicus.jpg";
import amicus2Pic from "../../imports/amicus 2.jpg";
import visitationPic from "../../imports/visitation.jpg";
import joggingPic from "../../imports/jogging.jpg";

interface Props { onBack: () => void; }

const LEADERS = [
  { name: "Sis. Alpha Joy Jabonete", role: "MaAYO President", photo: alphaPic, featured: true, pos: "object-top" },
  { name: "Sis. Lorlen Terante", role: "Organizer / Advisor", photo: lorlenPic, featured: false, pos: "object-right" },
  { name: "Charmaine Viven Arabelo", role: "Organizer / Advisor", photo: chammyPic, featured: false, pos: "object-right" },
];

const GALLERY = [
  { photo: amicusPic, caption: "AMiCUS Fellowship" },
  { photo: amicus2Pic, caption: "AMiCUS Fellowship" },
  { photo: visitationPic, caption: "Community Visitation" },
  { photo: joggingPic, caption: "Fellowship Jogging" },
];

const NETWORK = [
  { tag: "NOC", label: "Negros Occidental Conference" },
  { tag: "CNAYF", label: "Central Negros Adventist Youth Federation" },
  { tag: "PF", label: "Pathfinders" },
  { tag: "AMiCUS", label: "Public Campus Ministries · College & University Students" },
  { tag: "YP", label: "Young Professionals" },
  { tag: "CLAY", label: "Bago City District 1 Youth Organization" },
];

const ACTIVITIES = [
  { icon: "📖", title: "AYF Programs", desc: "Weekly youth programs every Saturday, 2:30–4:30 PM, featuring devotions, games, and spiritual discussions.", color: "#7C3AED" },
  { icon: "🤝", title: "Community Outreach", desc: "Reaching out to neighboring communities through service projects, health programs, and evangelism activities.", color: "#DB2777" },
  { icon: "🎤", title: "Youth Worship", desc: "Leading praise and worship during Sabbath services and special programs throughout the year.", color: "#0891B2" },
  { icon: "⛺", title: "Camps & Events", desc: "Joining youth camps and events across Negros Occidental with CNAYF, Pathfinders, AMiCUS, and YP.", color: "#EA580C" },
];

function FloatingOrbs() {
  const orbs = [
    { size: 280, top: "-8%", left: "-6%", from: "rgba(168,85,247,0.45)", dur: 9 },
    { size: 220, top: "30%", right: "-8%", from: "rgba(236,72,153,0.4)", dur: 11 },
    { size: 180, bottom: "-6%", left: "20%", from: "rgba(34,211,238,0.35)", dur: 7 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: `radial-gradient(circle, ${o.from}, transparent 70%)`,
          }}
          animate={{ x: [0, 24, -10, 0], y: [0, -20, 14, 0] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DotGrid({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    />
  );
}

export function MaAYOPage({ onBack }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-16" style={{ background: "#FAF8FF" }}>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-violet-100 flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-violet-50 transition-colors" aria-label="Back">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">MaAYO</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Youth Ministry · Malingin SDA Church</p>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: "58vh", minHeight: 340 }}>
        <img src={maayoPic} alt="Malingin Adventist Youth Organization" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(124,58,237,0.55) 0%, rgba(219,39,119,0.4) 45%, rgba(8,10,30,0.85) 100%)" }}
        />
        <FloatingOrbs />
        <div className="absolute bottom-0 px-5 pb-8 md:px-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-fuchsia-200" />
              <p className="font-[Lato] text-[10px] text-fuchsia-100 uppercase tracking-[0.25em]">Youth Ministry · Malingin SDA Church</p>
            </div>
            <h1
              className="font-[Playfair_Display] text-white font-extrabold leading-[0.95]"
              style={{ fontSize: "clamp(2.6rem, 9vw, 4.5rem)", textShadow: "0 4px 30px rgba(124,58,237,0.4)" }}
            >
              MaAYO
            </h1>
            <p className="font-[Lato] text-white/75 text-sm mt-3 max-w-sm leading-relaxed">
              Malingin Adventist Youth Organization — young, bold, and on fire for God.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── WHAT "MAAYO" MEANS — dark tech section ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #1e1240 0%, #2a1654 55%, #1a0f38 100%)" }}>
        <DotGrid />
        <FloatingOrbs />

        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-fuchsia-300/70 mb-1 relative">Our Identity</p>
          <h2 className="font-[Playfair_Display] text-white font-semibold mb-7 relative" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Why We're Called <span className="text-fuchsia-300 italic">MaAYO</span>
          </h2>
        </FadeUp>

        <FadeUp delay={80}>
          <div className="relative max-w-2xl space-y-4">
            <p className="font-[Lato] text-sm text-white/70 leading-relaxed">
              MaAYO is an active group inside <strong className="text-white">CLAY (Christ-Like Adventist Youth)</strong> — the Bago City District 1 Youth Organization. The name is acronymed that way because, in Hiligaynon, the word <em className="text-fuchsia-200">maayo</em> means <strong className="text-white">"good."</strong>
            </p>
            <p className="font-[Lato] text-sm text-white/70 leading-relaxed">
              As the group holds fast to the values of an Adventist youth, they also join youth camps and events around Negros Occidental — together with the wider Adventist youth network across the province.
            </p>
            <p className="font-[Lato] text-sm text-white/70 leading-relaxed">
              Together, they serve God and lead the church as He guides them — to serve and fulfill His plans for the future of the church and its people as leaders.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── LEADERSHIP ── */}
      <div className="px-5 md:px-14 py-12" style={{ background: "linear-gradient(180deg, #FAF8FF 0%, #F3EEFF 100%)" }}>
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-violet-600 mb-1">Leadership</p>
          <h2 className="font-[Playfair_Display] text-foreground font-semibold mb-7" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Who Leads MaAYO
          </h2>
        </FadeUp>

        <div className="flex flex-col md:flex-row gap-4 items-start">

          {/* Alpha — featured, portrait */}
          <FadeUp delay={0} className="w-full md:w-[42%]">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl shadow-md"
              style={{ aspectRatio: "3/4" }}
            >
              <img src={alphaPic} alt="Sis. Alpha Joy Jabonete" className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,16,90,0.95) 0%, rgba(46,16,90,0.25) 55%, transparent 100%)" }} />
              <div className="absolute top-3 left-3">
                <span className="bg-fuchsia-500/90 text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full">President</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-[Playfair_Display] text-white font-semibold leading-tight" style={{ fontSize: "1.15rem" }}>Sis. Alpha Joy Jabonete</p>
                <p className="font-[Lato] text-fuchsia-200/80 text-[10px] uppercase tracking-widest mt-1">MaAYO President</p>
              </div>
            </motion.div>
          </FadeUp>

          {/* Lorlen + Charmaine — equal side-by-side grid */}
          <div className="w-full md:flex-1 grid grid-cols-2 gap-3 md:gap-4">
            {LEADERS.filter(l => !l.featured).map((leader, i) => (
              <FadeUp key={leader.name} delay={(i + 1) * 90}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="relative overflow-hidden rounded-2xl shadow-md"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img src={leader.photo} alt={leader.name} className={`absolute inset-0 w-full h-full object-cover ${leader.pos}`} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,16,90,0.95) 0%, rgba(46,16,90,0.25) 55%, transparent 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-[Playfair_Display] text-white font-semibold leading-tight" style={{ fontSize: "1rem" }}>{leader.name}</p>
                    <p className="font-[Lato] text-fuchsia-200/80 text-[10px] uppercase tracking-widest mt-1">{leader.role}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>

        </div>
      </div>

      {/* ── NETWORK / AFFILIATIONS — tech node grid ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c0a24 0%, #1a1140 55%, #100b2e 100%)" }}>
        <DotGrid opacity={0.06} />

        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-cyan-300/70 mb-1 relative">Connected Across the Province</p>
          <h2 className="font-[Playfair_Display] text-white font-semibold mb-2 relative" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Our Network
          </h2>
          <p className="font-[Lato] text-white/40 text-xs mb-8 relative max-w-md">
            MaAYO joins youth camps and events under these organizations across Negros Occidental.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative">
          {NETWORK.map((n, i) => (
            <FadeUp key={n.tag} delay={i * 60}>
              <motion.div
                onHoverStart={() => setHovered(n.tag)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-4 border h-full"
                style={{
                  background: hovered === n.tag ? "rgba(168,85,247,0.14)" : "rgba(255,255,255,0.04)",
                  borderColor: hovered === n.tag ? "rgba(217,70,239,0.5)" : "rgba(255,255,255,0.1)",
                }}
              >
                <p
                  className="font-[Playfair_Display] font-bold text-fuchsia-300 mb-1.5"
                  style={{ fontSize: "1.1rem", letterSpacing: "0.02em" }}
                >
                  {n.tag}
                </p>
                <p className="font-[Lato] text-white/50 text-[11px] leading-snug">{n.label}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── WHAT WE DO ── */}
      <div className="px-5 md:px-14 py-12 bg-white">
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-violet-600 mb-1">Get Active</p>
          <h2 className="font-[Playfair_Display] text-foreground font-semibold mb-7" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            What We Do
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACTIVITIES.map((item, i) => (
            <FadeUp key={item.title} delay={i * 70}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-5 border h-full"
                style={{ borderColor: `${item.color}25`, background: `${item.color}0A` }}
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3"
                  style={{ background: `${item.color}18` }}
                >
                  {item.icon}
                </span>
                <h3 className="font-[Lato] text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="px-5 md:px-14 py-12" style={{ background: "linear-gradient(180deg, #FAF8FF 0%, #F3EEFF 100%)" }}>
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-violet-600 mb-1">Moments</p>
          <h2 className="font-[Playfair_Display] text-foreground font-semibold mb-7" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Life in MaAYO
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 gap-3">
          {GALLERY.map((item, i) => (
            <FadeUp key={item.caption + i} delay={i * 70}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-2xl shadow-sm"
                style={{ aspectRatio: "4/3" }}
              >
                <img src={item.photo} alt={item.caption} className="absolute inset-0 w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(46,16,90,0.85) 0%, rgba(46,16,90,0.05) 50%, transparent 100%)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-[Lato] text-white text-[11px] font-semibold uppercase tracking-wide leading-tight">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── JOIN + CONTACT ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #7C3AED 0%, #C026D3 55%, #DB2777 100%)" }}>
        <FloatingOrbs />

        <div className="relative flex flex-col md:flex-row gap-10 md:gap-8 items-start md:justify-between">

          {/* Left — heading, description, contact links */}
          <div className="flex-1 min-w-0 w-full md:max-w-md">
            <FadeUp>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-[Playfair_Display] text-white font-semibold" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
                    Join MaAYO
                  </h2>
                  <p className="font-[Lato] text-white/60 text-xs">Open to all youth members</p>
                </div>
              </div>
              <p className="font-[Lato] text-white/75 text-sm leading-relaxed mb-8">
                Every young person is welcome. Come as you are — join us every Saturday at 2:30 PM for the AYF Program. No experience needed, just a heart ready to grow.
              </p>
            </FadeUp>

            <div className="space-y-3">
              <FadeUp delay={0}>
                <a
                  href="https://www.facebook.com/malingin.church"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Facebook size={18} className="text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[Lato] text-[10px] text-white/40 uppercase tracking-widest">Facebook</p>
                    <p className="font-[Playfair_Display] text-white text-sm font-semibold">Malingin SDA Church</p>
                  </div>
                </a>
              </FadeUp>
              <FadeUp delay={70}>
                <a
                  href="mailto:sdamalingin@gmail.com"
                  className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Mail size={18} className="text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[Lato] text-[10px] text-white/40 uppercase tracking-widest">Email</p>
                    <p className="font-[Playfair_Display] text-white text-sm font-semibold">sdamalingin@gmail.com</p>
                  </div>
                </a>
              </FadeUp>
            </div>
          </div>

          {/* Right — Next Gathering highlight card */}
          <FadeUp delay={120} className="w-full md:w-[340px] shrink-0">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl p-7 bg-white/[0.1] backdrop-blur-sm border border-white/25 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
              <p className="font-[Lato] text-[10px] uppercase tracking-widest text-fuchsia-100/80 mb-2 relative">Next Gathering</p>
              <p className="font-[Playfair_Display] text-white font-bold leading-tight mb-5 relative" style={{ fontSize: "1.6rem" }}>
                AYF Program
              </p>

              <div className="space-y-4 relative">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="font-[Lato] text-white/55 text-xs uppercase tracking-widest">Day</span>
                  <span className="font-[Playfair_Display] text-white text-sm font-semibold">Every Saturday</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="font-[Lato] text-white/55 text-xs uppercase tracking-widest">Time</span>
                  <span className="font-[Playfair_Display] text-white text-sm font-semibold">2:30 – 4:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-[Lato] text-white/55 text-xs uppercase tracking-widest">Where</span>
                  <span className="font-[Playfair_Display] text-white text-sm font-semibold">Malingin SDA Church</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/15 relative">
                <p className="font-[Lato] text-white/60 text-xs leading-relaxed italic">
                  "Bring a friend — the more, the merrier." 🎉
                </p>
              </div>
            </motion.div>
          </FadeUp>

        </div>
      </div>

    </div>
  );
}
