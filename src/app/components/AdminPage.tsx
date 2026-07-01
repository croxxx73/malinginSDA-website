import { useState, useEffect, useCallback } from "react";
import {
  signInWithPopup, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy, arrayUnion, arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  ArrowLeft, LogOut, Plus, Pencil, Trash2, Check, X, Save,
  Megaphone, Calendar, BookOpen, CreditCard, Receipt, Users, Shield,
  Eye, EyeOff, Upload, ChevronDown,
} from "lucide-react";

import { auth, db, storage, googleProvider, isFirebaseReady } from "../../firebase";

interface Props { onBack: () => void; }

// ── Types ──────────────────────────────────────────────────────────────────────

interface Announcement {
  id: string; title: string; body: string;
  active: boolean; createdAt: string;
}
interface Event {
  id: string; title: string; tag: string;
  day: string; month: string; year: string;
  location: string; description: string; active: boolean;
}
interface Sermon {
  id: string; title: string; speaker: string;
  date: string; series: string; videoUrl: string;
  excerpt: string; active: boolean;
}
interface Transaction {
  id: string; donorName: string; donorEmail: string;
  amount: number; type: string; description: string;
  date: string; note: string;
}
interface GiveSettings {
  gCashName: string; gCashNumber: string;
  phone: string; qrCodeUrl: string;
}

// ── Tiny helpers ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Badge({ label, color = "blue" }: { label: string; color?: string }) {
  const map: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={`text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${map[color] ?? map.blue}`}>
      {label}
    </span>
  );
}

function FieldInput({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors resize-none"
      />
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="font-[Lato] text-xs text-muted-foreground">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"} relative`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </div>
    </label>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-2xl shadow-xl font-[Lato] text-sm text-white flex items-center gap-2 ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {type === "success" ? <Check size={14} /> : <X size={14} />}
      {msg}
    </div>
  );
}

// ── Announcements Tab ──────────────────────────────────────────────────────────

function AnnouncementsTab() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", body: "", active: true });
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)))
    );
  }, []);

  const resetForm = () => { setForm({ title: "", body: "", active: true }); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim()) return notify("Title is required.", "error");
    try {
      if (editing) {
        await updateDoc(doc(db, "announcements", editing), { ...form });
        notify("Announcement updated.");
      } else {
        await addDoc(collection(db, "announcements"), { ...form, createdAt: serverTimestamp() });
        notify("Announcement posted.");
      }
      resetForm();
    } catch { notify("Failed to save.", "error"); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await deleteDoc(doc(db, "announcements", id));
    notify("Deleted.");
  };

  const startEdit = (a: Announcement) => {
    setForm({ title: a.title, body: a.body, active: a.active });
    setEditing(a.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Announcements</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm({ title: "", body: "", active: true }); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Announcement</p>
          <FieldInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Announcement title" />
          <FieldTextarea label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} placeholder="Write the announcement..." rows={4} />
          <ToggleSwitch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Publish publicly" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
              <Save size={13} /> Save
            </button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No announcements yet.</p>
      ) : items.map((a) => (
        <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {a.active ? <Badge label="Published" color="green" /> : <Badge label="Draft" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-tight">{a.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(a)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil size={13} /></button>
            <button onClick={() => del(a.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Events Tab ─────────────────────────────────────────────────────────────────

const EVENT_TAGS = ["Youth", "Church", "Outreach", "Worship", "District", "Conference"];

function EventsTab() {
  const [items, setItems] = useState<Event[]>([]);
  const blank = { title: "", tag: "Church", day: "", month: "", year: "", location: "", description: "", active: true };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Event)))
    );
  }, []);

  const resetForm = () => { setForm(blank); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim() || !form.day || !form.month || !form.year) return notify("Title and date are required.", "error");
    try {
      if (editing) {
        await updateDoc(doc(db, "events", editing), { ...form });
        notify("Event updated.");
      } else {
        await addDoc(collection(db, "events"), { ...form, createdAt: serverTimestamp() });
        notify("Event added.");
      }
      resetForm();
    } catch { notify("Failed to save.", "error"); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    notify("Deleted.");
  };

  const startEdit = (e: Event) => {
    setForm({ title: e.title, tag: e.tag, day: e.day, month: e.month, year: e.year, location: e.location, description: e.description, active: e.active });
    setEditing(e.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Events</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Event</p>
          <FieldInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div>
            <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Tag</label>
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary">
              {EVENT_TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FieldInput label="Day" value={form.day} onChange={(v) => setForm({ ...form, day: v })} placeholder="5" />
            <FieldInput label="Month" value={form.month} onChange={(v) => setForm({ ...form, month: v })} placeholder="Dec" />
            <FieldInput label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2026" />
          </div>
          <FieldInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Malingin SDA Church" />
          <FieldTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Event details..." />
          <ToggleSwitch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Show publicly" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
              <Save size={13} /> Save
            </button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No events yet.</p>
      ) : items.map((e) => (
        <div key={e.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
          <div className="shrink-0 text-center w-12">
            <p className="font-[Playfair_Display] text-2xl font-bold text-primary leading-none">{e.day}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.month}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground">{e.year}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge label={e.tag} color="blue" />
              {!e.active && <Badge label="Hidden" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{e.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{e.location}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(e)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil size={13} /></button>
            <button onClick={() => del(e.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sermons Tab ────────────────────────────────────────────────────────────────

function SermonsTab() {
  const [items, setItems] = useState<Sermon[]>([]);
  const blank = { title: "", speaker: "", date: "", series: "Pag-uswag (2026)", videoUrl: "", excerpt: "", active: true };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "sermons"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sermon)))
    );
  }, []);

  const resetForm = () => { setForm(blank); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim() || !form.speaker.trim()) return notify("Title and speaker are required.", "error");
    try {
      if (editing) {
        await updateDoc(doc(db, "sermons", editing), { ...form });
        notify("Sermon updated.");
      } else {
        await addDoc(collection(db, "sermons"), { ...form, createdAt: serverTimestamp() });
        notify("Sermon added.");
      }
      resetForm();
    } catch { notify("Failed to save.", "error"); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this sermon?")) return;
    await deleteDoc(doc(db, "sermons", id));
    notify("Deleted.");
  };

  const startEdit = (s: Sermon) => {
    setForm({ title: s.title, speaker: s.speaker, date: s.date, series: s.series, videoUrl: s.videoUrl, excerpt: s.excerpt, active: s.active });
    setEditing(s.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Sermons</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Sermon</p>
          <FieldInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <FieldInput label="Speaker" value={form.speaker} onChange={(v) => setForm({ ...form, speaker: v })} placeholder="Pastor Ur Caro" />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="June 28, 2026" />
            <FieldInput label="Series" value={form.series} onChange={(v) => setForm({ ...form, series: v })} placeholder="Pag-uswag (2026)" />
          </div>
          <FieldInput label="Video URL (YouTube / Facebook / Drive)" value={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} placeholder="https://youtu.be/..." />
          <FieldTextarea label="Excerpt / Summary" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} placeholder="Brief description of the sermon..." />
          <ToggleSwitch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Publish" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
              <Save size={13} /> Save
            </button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No sermons yet.</p>
      ) : items.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge label={s.series} color="violet" />
              {!s.active && <Badge label="Hidden" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{s.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{s.date} · {s.speaker}</p>
            {s.videoUrl && <p className="font-[Lato] text-[10px] text-primary mt-1 truncate">{s.videoUrl}</p>}
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(s)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil size={13} /></button>
            <button onClick={() => del(s.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Give Settings Tab ──────────────────────────────────────────────────────────

function GiveSettingsTab() {
  const [settings, setSettings] = useState<GiveSettings>({ gCashName: "", gCashNumber: "", phone: "", qrCodeUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "give_settings", "main"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as GiveSettings);
    });
    return unsub;
  }, []);

  const save = async () => {
    try {
      await setDoc(doc(db, "give_settings", "main"), settings, { merge: true });
      notify("Give settings saved.");
    } catch { notify("Failed to save.", "error"); }
  };

  const uploadQR = async (file: File) => {
    setUploading(true);
    try {
      const r = ref(storage, `qr/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setSettings((s) => ({ ...s, qrCodeUrl: url }));
      notify("QR Code uploaded.");
    } catch { notify("Upload failed. You can also paste a URL manually.", "error"); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Give / Tithe Settings</h3>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold">GCash Info</p>
        <FieldInput label="GCash Account Name" value={settings.gCashName} onChange={(v) => setSettings((s) => ({ ...s, gCashName: v }))} placeholder="e.g. Malingin SDA Church" />
        <FieldInput label="GCash Number" value={settings.gCashNumber} onChange={(v) => setSettings((s) => ({ ...s, gCashNumber: v }))} placeholder="09XX XXX XXXX" />
        <FieldInput label="Phone Number (optional)" value={settings.phone} onChange={(v) => setSettings((s) => ({ ...s, phone: v }))} placeholder="09XX XXX XXXX" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold">QR Code</p>
        <FieldInput label="QR Code Image URL (paste from Google Drive / Imgur / etc.)" value={settings.qrCodeUrl} onChange={(v) => setSettings((s) => ({ ...s, qrCodeUrl: v }))} placeholder="https://..." />
        <div className="flex items-center gap-3">
          <span className="font-[Lato] text-xs text-muted-foreground">or upload from device:</span>
          <label className={`flex items-center gap-2 cursor-pointer bg-secondary border border-border px-4 py-2 rounded-full font-[Lato] text-xs font-bold hover:bg-border transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload size={13} />
            {uploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadQR(e.target.files[0])} />
          </label>
        </div>
        {settings.qrCodeUrl && (
          <img src={settings.qrCodeUrl} alt="GCash QR" className="w-32 h-32 object-contain border border-border rounded-xl" />
        )}
      </div>

      <button onClick={save} className="flex items-center gap-2 bg-primary text-white font-[Lato] text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
        <Save size={15} /> Save Settings
      </button>
    </div>
  );
}

// ── Transactions Tab ───────────────────────────────────────────────────────────

const TX_TYPES = ["Tithe", "Offering", "Donation", "Building Fund", "Welfare", "Other"];

function TransactionsTab() {
  const [items, setItems] = useState<Transaction[]>([]);
  const blank = { donorName: "", donorEmail: "", amount: 0, type: "Tithe", description: "", date: "", note: "" };
  const [form, setForm] = useState<Omit<Transaction, "id">>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)))
    );
  }, []);

  const resetForm = () => { setForm(blank); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.donorName.trim() || !form.amount) return notify("Name and amount are required.", "error");
    try {
      const payload = { ...form, amount: Number(form.amount), createdAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(db, "transactions", editing), payload);
        notify("Transaction updated.");
      } else {
        await addDoc(collection(db, "transactions"), payload);
        notify("Transaction logged.");
      }
      resetForm();
    } catch { notify("Failed to save.", "error"); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await deleteDoc(doc(db, "transactions", id));
    notify("Deleted.");
  };

  const startEdit = (t: Transaction) => {
    setForm({ donorName: t.donorName, donorEmail: t.donorEmail, amount: t.amount, type: t.type, description: t.description, date: t.date, note: t.note });
    setEditing(t.id);
    setShowForm(true);
  };

  const total = items.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Transactions</h3>
          <p className="font-[Lato] text-xs text-muted-foreground">Total recorded: <strong className="text-foreground">₱{total.toLocaleString()}</strong></p>
        </div>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
          <Plus size={13} /> Log
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Transaction</p>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Donor Name" value={form.donorName} onChange={(v) => setForm({ ...form, donorName: v })} placeholder="Full name" />
            <FieldInput label="Donor Email (optional)" value={form.donorEmail} onChange={(v) => setForm({ ...form, donorEmail: v })} placeholder="email@gmail.com" type="email" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Amount (₱)" value={String(form.amount || "")} onChange={(v) => setForm({ ...form, amount: parseFloat(v) || 0 })} type="number" placeholder="0.00" />
            <div>
              <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary">
                {TX_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="June 28, 2026" />
            <FieldInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Sabbath tithe..." />
          </div>
          <FieldInput label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} placeholder="Any additional note" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
              <Save size={13} /> Save
            </button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No transactions logged yet.</p>
      ) : items.map((t) => (
        <div key={t.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="shrink-0 text-right w-20">
            <p className="font-[Playfair_Display] text-base font-bold text-primary">₱{Number(t.amount).toLocaleString()}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{t.type}</p>
          </div>
          <div className="flex-1 min-w-0 border-l border-border pl-3">
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-tight">{t.donorName}</p>
            <p className="font-[Lato] text-xs text-muted-foreground">{t.date}{t.description ? ` · ${t.description}` : ""}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(t)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"><Pencil size={13} /></button>
            <button onClick={() => del(t.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Admins Tab (super admin only) ──────────────────────────────────────────────

function AdminsTab({ superAdminEmail }: { superAdminEmail: string }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "adminEmails"), (snap) => {
      if (snap.exists()) setEmails(snap.data().emails || []);
    });
    return unsub;
  }, []);

  const addAdmin = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email.includes("@")) return notify("Enter a valid email.", "error");
    if (emails.includes(email)) return notify("Already an admin.", "error");
    try {
      await setDoc(doc(db, "config", "adminEmails"), { emails: arrayUnion(email) }, { merge: true });
      setNewEmail("");
      notify(`${email} added as admin.`);
    } catch { notify("Failed to add.", "error"); }
  };

  const removeAdmin = async (email: string) => {
    if (email === superAdminEmail) return notify("Cannot remove the super admin.", "error");
    if (!confirm(`Remove ${email} from admins?`)) return;
    try {
      await setDoc(doc(db, "config", "adminEmails"), { emails: arrayRemove(email) }, { merge: true });
      notify("Admin removed.");
    } catch { notify("Failed.", "error"); }
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Manage Admins</h3>
      <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
        Add a person's Gmail address here. The next time they sign in with that Google account at <strong className="text-foreground">yoursite.com/#admin</strong>, they'll get access automatically.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Shield size={15} className="text-amber-600 shrink-0" />
        <div>
          <p className="font-[Lato] text-xs font-bold text-amber-800">Super Admin</p>
          <p className="font-[Lato] text-xs text-amber-700">{superAdminEmail}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAdmin()}
          placeholder="admin@gmail.com"
          className="flex-1 border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
        />
        <button onClick={addAdmin} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> Add
        </button>
      </div>

      {emails.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-8">No additional admins yet.</p>
      ) : (
        <div className="space-y-2">
          {emails.filter((e) => e !== superAdminEmail).map((email) => (
            <div key={email} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <p className="font-[Lato] text-sm text-foreground">{email}</p>
              <button onClick={() => removeAdmin(email)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "events",        label: "Events",         icon: Calendar },
  { id: "sermons",       label: "Sermons",         icon: BookOpen },
  { id: "give",          label: "Give Settings",   icon: CreditCard },
  { id: "transactions",  label: "Transactions",    icon: Receipt },
  { id: "admins",        label: "Admins",          icon: Users },
];

// ── Main AdminPage ─────────────────────────────────────────────────────────────

export function AdminPage({ onBack }: Props) {
  const [user, setUser]                 = useState<import("firebase/auth").User | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [activeTab, setActiveTab]       = useState("announcements");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [error, setError]               = useState("");

  const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "";

  const checkAdmin = useCallback(async (u: import("firebase/auth").User) => {
    setCheckingAdmin(true);
    try {
      const isSA = u.email === superAdminEmail;
      if (isSA) {
        setIsAdmin(true);
        setIsSuperAdmin(true);
        // Auto-register super admin in config if first time
        const cfgSnap = await getDoc(doc(db, "config", "adminEmails"));
        if (!cfgSnap.exists() || !(cfgSnap.data().emails || []).includes(u.email)) {
          await setDoc(doc(db, "config", "adminEmails"), { emails: arrayUnion(u.email) }, { merge: true });
        }
      } else {
        const cfgSnap = await getDoc(doc(db, "config", "adminEmails"));
        const emails: string[] = cfgSnap.exists() ? (cfgSnap.data().emails || []) : [];
        if (emails.includes(u.email ?? "")) {
          setIsAdmin(true);
          setIsSuperAdmin(false);
        } else {
          setIsAdmin(false);
          setError("Your account is not registered as an admin. Contact the website creator to get access.");
        }
      }
    } catch {
      setError("Failed to verify admin access. Check your internet connection.");
    }
    setCheckingAdmin(false);
  }, [superAdminEmail]);

  useEffect(() => {
    if (!isFirebaseReady) { setAuthLoading(false); return; }
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setError("");
      if (u) await checkAdmin(u);
      setAuthLoading(false);
    });
  }, [checkAdmin]);

  const signIn = async () => {
    setError("");
    try { await signInWithPopup(auth, googleProvider); }
    catch (e: unknown) {
      if ((e as { code?: string }).code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setError("");
  };

  // ── Not configured ──────────────────────────────────────────────────────────

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-amber-600" />
          </div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-3">Firebase not configured</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-6">
            Fill in your Firebase credentials in <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.env.local</code> to enable the admin panel. See the setup guide below.
          </p>
          <div className="bg-secondary rounded-2xl p-5 text-left space-y-2 mb-6">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Setup Steps</p>
            {[
              "Go to console.firebase.google.com",
              "Create a new project (e.g. \"malingin-sda\")",
              "Add a Web App → copy the firebaseConfig values",
              "Enable Authentication → Sign-in method → Google",
              "Create a Firestore Database (start in test mode for now)",
              "Enable Storage (for QR code upload)",
              "Fill in .env.local with the config values",
              "Set VITE_SUPER_ADMIN_EMAIL to your Gmail address",
              "Restart the dev server (npm run dev)",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="font-[Lato] text-[10px] font-bold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="font-[Lato] text-xs text-foreground">{step}</p>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="flex items-center gap-2 font-[Lato] text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors">
            <ArrowLeft size={15} /> Back to site
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-[Lato] text-sm text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  // ── Login screen ────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full">
          <button onClick={onBack} className="flex items-center gap-1.5 font-[Lato] text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to site
          </button>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
            <Shield size={22} className="text-primary" />
          </div>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Admin Access</p>
          <h1 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-2">Malingin Church</h1>
          <p className="font-[Lato] text-sm text-muted-foreground mb-8 leading-relaxed">
            Sign in with your registered Gmail account to manage the website content.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <X size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="font-[Lato] text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}
          <button onClick={signIn}
            className="w-full flex items-center justify-center gap-3 bg-card border border-border rounded-2xl py-3.5 font-[Lato] text-sm font-bold text-foreground hover:bg-secondary active:scale-[0.98] transition-all shadow-sm">
            <GoogleIcon /> Continue with Google
          </button>
          <p className="font-[Lato] text-[10px] text-muted-foreground text-center mt-6 leading-relaxed">
            Only registered admins can access this panel.<br />Contact the site creator to request access.
          </p>
        </div>
      </div>
    );
  }

  // ── Not authorized ──────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={22} className="text-red-500" />
          </div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-3">Not Authorized</h2>
          <p className="font-[Lato] text-sm text-muted-foreground mb-2">Signed in as:</p>
          <p className="font-[Lato] text-sm font-bold text-foreground mb-6">{user.email}</p>
          {error && <p className="font-[Lato] text-xs text-red-600 mb-6 leading-relaxed">{error}</p>}
          <div className="flex flex-col gap-2">
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-2xl py-3 font-[Lato] text-sm font-bold text-foreground hover:bg-border transition-colors">
              <LogOut size={15} /> Sign out & try another account
            </button>
            <button onClick={onBack} className="flex items-center justify-center gap-1.5 font-[Lato] text-xs text-muted-foreground hover:text-foreground transition-colors py-2">
              <ArrowLeft size={14} /> Back to site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  const visibleTabs = isSuperAdmin ? TABS : TABS.filter((t) => t.id !== "admins");
  const activeTabData = visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors shrink-0">
          <ArrowLeft size={17} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Admin Panel</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground truncate">{user.email}</p>
        </div>
        {isSuperAdmin && <Badge label="Super Admin" color="violet" />}
        <button onClick={handleSignOut} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors shrink-0" title="Sign out">
          <LogOut size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-57px)]">

        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-secondary/30 p-3 gap-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all font-[Lato] text-sm ${activeTab === tab.id ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-border hover:text-foreground"}`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6">

          {/* Mobile tab selector */}
          <div className="md:hidden mb-5">
            <button
              onClick={() => setMobileTabOpen((o) => !o)}
              className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2.5 font-[Lato] text-sm font-bold text-foreground">
                {(() => { const Icon = activeTabData.icon; return <Icon size={15} />; })()}
                {activeTabData.label}
              </div>
              <ChevronDown size={15} className={`text-muted-foreground transition-transform ${mobileTabOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileTabOpen && (
              <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setMobileTabOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left font-[Lato] text-sm transition-colors border-b border-border last:border-b-0 ${activeTab === tab.id ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-secondary"}`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "announcements" && <AnnouncementsTab />}
          {activeTab === "events"        && <EventsTab />}
          {activeTab === "sermons"       && <SermonsTab />}
          {activeTab === "give"          && <GiveSettingsTab />}
          {activeTab === "transactions"  && <TransactionsTab />}
          {activeTab === "admins" && isSuperAdmin && <AdminsTab superAdminEmail={superAdminEmail} />}
        </main>
      </div>
    </div>
  );
}
