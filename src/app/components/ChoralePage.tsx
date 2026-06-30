import { useState } from "react";
import { ArrowLeft, Mail, Facebook, Play, X } from "lucide-react";
import { FadeUp } from "./FadeUp";
import macPic from "../../imports/mac_pic.jpg";
import concertPhoto from "../../imports/concert.jpg";
import cantatePhoto from "../../imports/Cantate_Adoremus.jpg";
import ainPhoto from "../../imports/ain.jpg";
import lorlenPhoto from "../../imports/lorlen.jpg";
import skyPhoto from "../../imports/sky.jpg";
import video1 from "../../imports/Behold our God NOC.mp4";
import video2 from "../../imports/For Your Beauty NOC.mp4";

interface Props { onBack: () => void; }

const PERFORMANCES = [
  { id: "behold", title: "Behold Our God", src: video1 },
  { id: "beauty", title: "For Your Beauty", src: video2 },
];

const INFO_CARDS = [
  { label: "Choirmaster", value: "Shiloh Marfil", bg: "#EBF5FF", border: "#BFDBFE", text: "#1D6FAA" },
  { label: "Ministry", value: "Music & Worship", bg: "#EEF2FF", border: "#C7D2FE", text: "#3730A3" },
  { label: "Reach", value: "District & Conference", bg: "#F0F9FF", border: "#BAE6FD", text: "#0369A1" },
];

function StaffLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[22, 34, 46, 58, 70].map((top) => (
        <div key={top} className="absolute w-full" style={{ top: `${top}%`, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      ))}
    </div>
  );
}

function FloatingNotes({ light = false }: { light?: boolean }) {
  const color = light ? "rgba(12,60,120,0.055)" : "rgba(255,255,255,0.06)";
  const notes = ["𝄞", "♪", "♫", "♩", "♪", "♫", "♩", "𝄞"];
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
      {notes.map((n, i) => (
        <span key={i} className="absolute" style={{ color, fontSize: `${22 + (i % 4) * 22}px`, top: `${(i * 13) % 95}%`, left: `${(i * 12 + 3) % 92}%`, transform: `rotate(${-18 + i * 9}deg)` }}>
          {n}
        </span>
      ))}
    </div>
  );
}

export function ChoralePage({ onBack }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const selected = PERFORMANCES.find((p) => p.id === activeId);

  return (
    <div className="min-h-screen pb-16" style={{ background: "#F2F8FF" }}>

      {/* ── VIDEO MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(4,8,20,0.97)" }}
          onClick={() => setActiveId(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center z-10 hover:bg-white/20 transition-colors"
            onClick={() => setActiveId(null)}
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
          <div className="w-full max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
            <p className="font-[Lato] text-white/30 text-[10px] uppercase tracking-[0.22em] text-center mb-2">
              BEYOND IMAGINATION · NOC Evangelistic Center, Bacolod City
            </p>
            <p className="font-[Playfair_Display] text-white text-lg font-semibold italic text-center mb-5">
              {selected.title}
            </p>
            <video key={selected.id} src={selected.src} controls autoPlay className="w-full rounded-2xl shadow-2xl" style={{ maxHeight: "68vh", background: "#000" }} />
          </div>
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-sky-100 flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 transition-colors" aria-label="Back">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Malingin Advent Chorale</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Music Ministry · Malingin SDA Church</p>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: "55vh", minHeight: 320 }}>
        <img src={macPic} alt="Malingin Advent Chorale" className="absolute inset-0 w-full h-full object-cover object-[center_60%]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
          {["𝄞", "♫", "♪", "♩"].map((n, i) => (
            <span key={i} className="absolute text-white" style={{ fontSize: `${28 + i * 22}px`, opacity: 0.07, top: `${12 + i * 18}%`, right: `${4 + i * 9}%`, transform: `rotate(${-8 + i * 14}deg)` }}>{n}</span>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,48,0.95) 0%, rgba(8,18,48,0.35) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 px-5 pb-8 md:px-14">
          <p className="font-[Lato] text-[10px] text-white/40 uppercase tracking-[0.25em] mb-2">Music Ministry · Malingin SDA Church</p>
          <h1 className="font-[Playfair_Display] text-white font-semibold italic leading-tight" style={{ fontSize: "clamp(1.7rem, 5vw, 2.8rem)" }}>
            Malingin Advent Chorale
          </h1>
          <p className="font-[Lato] text-white/45 text-sm mt-2 max-w-xs leading-relaxed">Songs that touch the heart · God's Word through music</p>
        </div>
      </div>

      {/* ── OUR STORY + INFO CARDS (two-column) ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #e8f4ff 0%, #dbeafe 45%, #e0f2fe 100%)" }}>
        <FloatingNotes light />
        <FadeUp>
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-start">

            {/* Text — left */}
            <div className="flex-1 min-w-0">
              <p className="font-[Lato] text-[10px] uppercase tracking-widest text-sky-600 mb-1">Our Story</p>
              <h2 className="font-[Playfair_Display] font-semibold text-foreground mb-1" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>
                From Choir to Chorale
              </h2>
              <p className="font-[Lato] text-[10px] text-sky-500 uppercase tracking-widest mb-6">
                Formerly Malingin SDA Choir · Renamed June 2026
              </p>

              <div className="space-y-4">
                <p className="font-[Lato] text-sm text-foreground/75 leading-relaxed">
                  The <strong className="text-foreground">Malingin Advent Chorale</strong> was once known as the <em>Malingin SDA Choir</em>. At first, they were composed of those who organized the church — faithful members who carried both the dream of a congregation and a song in their hearts.
                </p>
                <p className="font-[Lato] text-sm text-foreground/75 leading-relaxed">
                  As new members came to Malingin Church, they were invited to try and sing with the choir. One by one, they became full-fledged members — up to this day. Some were already seasoned singers, but <strong className="text-foreground">most of them were non-singers</strong>.
                </p>
                <blockquote className="pl-4 border-l-2 border-sky-400 py-1">
                  <p className="font-[Playfair_Display] text-foreground/80 text-sm italic leading-relaxed">
                    "With the blessing and grace of God, they learned the voice and acquired the confidence to sing any song taught — and to grab every opportunity given to them."
                  </p>
                </blockquote>
                <p className="font-[Lato] text-sm text-foreground/75 leading-relaxed">
                  They are one of Malingin Church's thriving ministries across the district and conference. It is their prayer and hope to bless many more people with songs that touch their hearts and teach God's Word through music.
                </p>
              </div>
            </div>

            {/* Info cards — right */}
            <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-3">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="flex-1 md:flex-none rounded-2xl px-4 py-5 text-center border"
                  style={{ background: card.bg, borderColor: card.border }}
                >
                  <p className="font-[Lato] text-[9px] uppercase tracking-widest mb-1.5" style={{ color: card.text }}>{card.label}</p>
                  <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-snug">{card.value}</p>
                </div>
              ))}
            </div>

          </div>
        </FadeUp>
      </div>

      {/* ── PERFORMANCES ── deep navy */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1630 0%, #0d2458 60%, #0b1f4a 100%)" }}>
        <StaffLines />
        <FloatingNotes />

        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/30 mb-1 relative">Live Performances</p>
          <h2 className="font-[Playfair_Display] text-white font-semibold mb-1 relative" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            BEYOND IMAGINATION
          </h2>
          <p className="font-[Lato] text-white/35 text-xs mb-8 relative">
            Your Pathway to Living · NOC Evangelistic Center, Bacolod City · June 2026
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          {PERFORMANCES.map((perf, i) => (
            <FadeUp key={perf.id} delay={i * 100}>
              <button
                onClick={() => setActiveId(perf.id)}
                className="w-full relative overflow-hidden rounded-2xl group text-left focus:outline-none bg-black"
                style={{ aspectRatio: "16/9" }}
                aria-label={`Play ${perf.title}`}
              >
                {/* Video as thumbnail — shows its own first frame */}
                <video
                  src={perf.src}
                  preload="metadata"
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,10,30,0.95) 0%, rgba(4,10,30,0.4) 55%, transparent 100%)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Play size={22} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <p className="font-[Playfair_Display] text-white font-semibold italic text-base leading-tight">{perf.title}</p>
                  <p className="font-[Lato] text-white/40 text-[10px] mt-1 uppercase tracking-widest">Tap to watch</p>
                </div>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── PAST EVENTS ── */}
      <div className="px-5 md:px-14 py-12" style={{ background: "linear-gradient(180deg, #F2F8FF 0%, #E8F4FF 100%)" }}>
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-sky-600 mb-1">Milestones</p>
          <h2 className="font-[Playfair_Display] text-foreground font-semibold mb-8" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Past Events
          </h2>
        </FadeUp>

        <div className="space-y-6">

          {/* Not One Falls: The Musical */}
          <FadeUp delay={60}>
            <div className="rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-white">
              {/* 3-photo actor strip */}
              <div className="grid grid-cols-3 h-52">
                {[
                  { photo: skyPhoto, name: "Shekinah Marfil", role: "The Youth" },
                  { photo: lorlenPhoto, name: "Lorlen Terante", role: "The Adult" },
                  { photo: ainPhoto, name: "Ain Arabelo", role: "The Mother" },
                ].map((actor, i) => (
                  <div key={i} className="relative overflow-hidden">
                    <img src={actor.photo} alt={actor.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,15,45,0.92) 0%, rgba(6,15,45,0.15) 55%, transparent 100%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 text-center">
                      <p className="font-[Playfair_Display] text-white text-[11px] font-semibold leading-tight">{actor.name}</p>
                      <p className="font-[Lato] text-white/50 text-[9px] uppercase tracking-wide mt-0.5">{actor.role}</p>
                    </div>
                    {/* Divider */}
                    {i < 2 && <div className="absolute top-0 right-0 bottom-0 w-px bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-sky-100 text-sky-700 text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Musical</span>
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">4th Anniversary</span>
                    </div>
                    <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">December 2025</p>
                    <h3 className="font-[Playfair_Display] text-foreground text-base font-semibold italic mt-1 leading-snug">
                      Not One Falls: The Musical
                    </h3>
                  </div>
                </div>
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
                  A musical event produced for the <strong className="text-foreground">4th Anniversary of Malingin SDA Church</strong>. The story follows the journey of a life — from a left-behind youth, to a very busy adult, to a challenged mother and wife — a narrative of God's unfailing faithfulness through every season.
                </p>
                <div className="border-t border-sky-100 pt-3 mt-3 space-y-1">
                  <p className="font-[Lato] text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Cast:</span> Malingin Advent Chorale
                  </p>
                  <p className="font-[Lato] text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Narrator:</span> Anessa Lyca Galido
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Cantate Adoremus */}
          <FadeUp delay={120}>
            <div className="rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-white">
              <div className="relative grid grid-cols-2" style={{ height: "220px" }}>
                {/* Left photo */}
                <div className="relative overflow-hidden">
                  <img src={concertPhoto} alt="Cantate Adoremus concert" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,50,0.85) 0%, rgba(8,18,50,0.1) 60%, transparent 100%)" }} />
                </div>
                {/* Right photo */}
                <div className="relative overflow-hidden border-l border-white/10">
                  <img src={cantatePhoto} alt="Cantate Adoremus performance" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,50,0.85) 0%, rgba(8,18,50,0.1) 60%, transparent 100%)" }} />
                </div>
                {/* Overlay badges + title across both photos */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                  <span className="bg-sky-500/85 text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Concert</span>
                  <span className="bg-amber-500/85 text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Fundraiser</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
                  <p className="font-[Lato] text-white/45 text-[10px] uppercase tracking-widest mb-1">February 2025</p>
                  <p className="font-[Playfair_Display] text-white text-base font-semibold italic leading-snug">
                    Cantate Adoremus: Sing, Let Us Adore!
                  </p>
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
                  The church's very first concert — a sacred program featuring messages shared through songs, hymns that uplifted and called listeners to worship. It was also a fundraiser to support various church projects, produced by the <strong className="text-foreground">Malingin Advent Chorale</strong>.
                </p>
                <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
                  <p className="font-[Lato] text-[10px] uppercase tracking-widest text-sky-600 mb-1">Guest Singer</p>
                  <p className="font-[Playfair_Display] text-foreground text-sm font-semibold">Lyndou Magbanua Lila</p>
                  <p className="font-[Lato] text-xs text-muted-foreground mt-1 leading-relaxed">
                    Member of the World Choir Champions <strong className="text-foreground">AUP Ambassadors</strong> and a thriving vocal soloist serving God through music.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>

      {/* ── JOIN THE CHORALE ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #1559A8 0%, #1A6FC0 50%, #2563EB 100%)" }}>
        <StaffLines />
        <FloatingNotes />

        <div className="relative flex flex-col md:flex-row gap-10 md:gap-12 items-start md:justify-between">

          {/* Left — heading + description */}
          <div className="flex-1 min-w-0 md:max-w-lg">
            <FadeUp>
              <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/35 mb-1">Be Part of the Harmony</p>
              <h2 className="font-[Playfair_Display] text-white font-semibold mb-4" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
                Join the Chorale
              </h2>
              <p className="font-[Lato] text-white/65 text-sm leading-relaxed">
                No formal training required — just a willing voice and a faithful heart. Whether you're a seasoned singer or have never sung before, the Malingin Advent Chorale has a place for you. Reach out to us and let your voice become part of God's music.
              </p>
            </FadeUp>
          </div>

          {/* Right — contact links */}
          <div className="w-full md:w-[340px] shrink-0 space-y-3">
            <FadeUp delay={0}>
              <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/35 mb-3">Reach Out</p>
              <a href="https://www.facebook.com/malingin.church" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Facebook size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Facebook</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">Malingin SDA Church</p>
                </div>
              </a>
            </FadeUp>
            <FadeUp delay={70}>
              <a href="https://www.facebook.com/Terante1993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Facebook size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Facebook</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">Lorlen Terante</p>
                </div>
              </a>
            </FadeUp>
            <FadeUp delay={140}>
              <a href="mailto:sdamalingin@gmail.com" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Mail size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Email</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">sdamalingin@gmail.com</p>
                </div>
              </a>
            </FadeUp>
          </div>

        </div>
      </div>

    </div>
  );
}
