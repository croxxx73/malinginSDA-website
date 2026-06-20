import React from "react";
import { Phone, Mail, ChevronRight, MapPin, Facebook } from "lucide-react";

import communityPhoto from "../../imports/malingin_community.jpg";
import maayoPic from "../../imports/MaAYO_pic.jpg";
import choralePic from "../../imports/Chorale_pic.jpg";

type PageId = "main" | "maayo" | "chorale" | "about" | "give" | "prayer" | "inquiry" | "connect";

export function ConnectPage({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: PageId) => void }) {
  const MINISTRIES = [
    {
      id: "maayo" as PageId,
      name: "MaAYO",
      fullName: "Malingin Adventist Youth Organization",
      desc: "Every Saturday · AYF Program 2:30 PM",
      photo: maayoPic,
    },
    {
      id: "chorale" as PageId,
      name: "Advent Chorale",
      fullName: "Malingin Advent Chorale",
      desc: "Music & worship ministry",
      photo: choralePic,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-4 px-5 py-3">
        <button onClick={onBack} className="px-3 py-2 rounded-md hover:bg-secondary">Back</button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Connect</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Get involved · Ministries · Contact</p>
        </div>
      </header>

      <main className="p-5 pb-24">
        <div className="relative h-44 overflow-hidden rounded-xl mb-6">
          <img src={communityPhoto} alt="Community" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/75 to-transparent" />
        </div>

        <div className="space-y-4">
          {MINISTRIES.map((m) => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="w-full flex items-center gap-0 bg-card border border-border rounded-xl overflow-hidden hover:bg-secondary active:scale-[0.98] transition-all text-left"
            >
              <div className="w-24 h-20 shrink-0">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 px-4 py-3">
                <p className="font-[Playfair_Display] text-base font-semibold text-foreground leading-tight">{m.name}</p>
                <p className="font-[Lato] text-xs text-accent mb-0.5">{m.fullName}</p>
                <p className="font-[Lato] text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0 mr-4" />
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="font-[Playfair_Display] text-base font-semibold text-foreground mb-2">Get in Touch</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-[Lato] text-xs text-muted-foreground">Phone</p>
                  <p className="font-[Lato] text-sm text-muted-foreground italic">To be announced</p>
                </div>
              </div>

              <a href="mailto:sdamalingin@gmail.com" className="flex items-center gap-3 hover:bg-secondary transition-colors">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-[Lato] text-xs text-muted-foreground">Email</p>
                  <p className="font-[Lato] text-sm font-bold text-foreground">sdamalingin@gmail.com</p>
                </div>
              </a>

              <a href="https://www.facebook.com/malingin.church" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:bg-secondary transition-colors">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Facebook size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-[Lato] text-xs text-muted-foreground">Facebook</p>
                  <p className="font-[Lato] text-sm font-bold text-foreground">Malingin Seventh-Day Adventist Church</p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-[Lato] text-xs text-muted-foreground">Address</p>
                  <p className="font-[Lato] text-sm font-bold text-foreground">Brgy. Malingin, Bago City</p>
                  <p className="font-[Lato] text-xs text-muted-foreground">Negros Occidental, Philippines</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.865727548701!2d122.9065936460828!3d10.497939062529491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aec80520d25b9f%3A0x4572c9694808d21!2sMalingin%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sph!4v1781880131972!5m2!1sen!2sph"
              width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Malingin SDA Church Location"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConnectPage;
