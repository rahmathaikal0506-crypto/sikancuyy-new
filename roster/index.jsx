// ============================================================
//  TRJT 2A — React App
//  Features: Dark/Light mode, Live indicator, Search/Filter,
//            Tab transitions, Notification, a11y, modular data
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─────────────────────────────────────────
//  DATA  (would be separate JSON in prod)
// ─────────────────────────────────────────
const DATA = {
  jadwal: {
    senin: [
      { mk: "Saluran Transmisi", dosen: "Ipan Suandi, S.T., M.T.", ruang: "Ruang 10", gedung: "Gedung 1", jam: "07:30", sel: "09:10" },
      { mk: "Praktikum Komunikasi Data", dosen: "Fakhrur Razi, S.ST., M.T.", ruang: "Lab 11", gedung: "Gedung 2", jam: "09:10", sel: "12:00" },
    ],
    selasa: [
      { mk: "Komunikasi Data", dosen: "Fakhrur Razi, S.ST., M.T.", ruang: "Ruang 10", gedung: "Gedung 1", jam: "07:30", sel: "09:10" },
      { mk: "Pendidikan Kewarganegaraan", dosen: "Novy Quentiena R., SH., MH.", ruang: "Ruang 4", gedung: "Gedung 1", jam: "09:10", sel: "11:10" },
    ],
    rabu: [
      { mk: "Praktikum Teknik Gelombang Mikro", dosen: "Munawar, S.T., M.T.", ruang: "Lab 23", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
      { mk: "Sistem Komunikasi Serat Optik", dosen: "Anita Fauziah, S.ST., M.T.", ruang: "Ruang 26", gedung: "Gedung 4", jam: "10:20", sel: "12:50" },
    ],
    kamis: [
      { mk: "Praktikum Saluran Transmisi", dosen: "Ipan Suandi, S.T., M.T.", ruang: "Lab 23", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
      { mk: "Teknik Gelombang Mikro", dosen: "Munawar, S.T., M.T.", ruang: "Ruang 16", gedung: "Gedung 3", jam: "10:20", sel: "12:00" },
    ],
    jumat: [
      { mk: "Praktikum Jaringan Komputer", dosen: "Hanafi, S.T., M.T.", ruang: "Lab 13", gedung: "Gedung 2", jam: "07:30", sel: "10:00" },
      { mk: "Jaringan Komputer", dosen: "Hanafi, S.T., M.T.", ruang: "Ruang 29", gedung: "Gedung 4", jam: "10:20", sel: "12:00" },
    ],
  },
  kelompok: {
    "Komunikasi Data": {
      dosen: "Fakhrur Razi, S.ST., M.T.",
      groups: [
        { name: "Kelompok 1", members: [{ id: "2024203020032", name: "Lunna Auamara" }, { id: "2024203020016", name: "Renka Laura" }, { id: "2024203020025", name: "Farhan Alfarsiyi" }, { id: "2024203020029", name: "Muhammad Rais" }] },
        { name: "Kelompok 2", members: [{ id: "2024203020019", name: "Khairul Fajar Sidiq" }, { id: "2024203020011", name: "Durratul Hikmah" }, { id: "2024203020020", name: "Nesya Zikriya" }, { id: "2024203020006", name: "Suheil Maulana" }] },
        { name: "Kelompok 3", members: [{ id: "2024203020003", name: "Sarah Fonna" }, { id: "2024203020028", name: "Aqil Ocean Difra" }, { id: "2024203020031", name: "Syawal Fitriyadi" }, { id: "2024203020009", name: "Firlita Afianti" }] },
        { name: "Kelompok 4", members: [{ id: "2024203020008", name: "Rahmat Haikal" }, { id: "2024203020001", name: "Ilal Ilhamdi" }, { id: "2024203020022", name: "Muhammad Halfi Al Barizi" }, { id: "2024203020036", name: "Nazar Al Farabi" }, { id: "2024203020013", name: "Afriansyah Sinamo" }] },
      ],
    },
    "Saluran Transmisi": {
      dosen: "Ipan Suandi, S.T., M.T.",
      groups: [
        { name: "Kelompok I", members: [{ id: "2024203020035", name: "Afriansyah Sinamo" }, { id: "2024203020019", name: "Khairul Fajar Sidiq" }, { id: "2024203020008", name: "Rahmat Haikal" }] },
        { name: "Kelompok II", members: [{ id: "2024203020011", name: "Durratul Hikmah" }, { id: "2024203020003", name: "Sarah Fonna" }, { id: "2024203020001", name: "Ilal Ilhamdi" }] },
        { name: "Kelompok III", members: [{ id: "2024203020016", name: "Renka Laura" }, { id: "2024203020006", name: "Suheil Maulana" }, { id: "2024203020009", name: "Firlita Afianti" }] },
        { name: "Kelompok IV", members: [{ id: "2024203020022", name: "Muhammad Halfi Al Barizi" }, { id: "2024203020031", name: "Syawal Fitriyadi" }] },
        { name: "Kelompok V", members: [{ id: "2024203020025", name: "Farhan Alfarsiyi" }, { id: "2024203020020", name: "Nesya Zikriya" }, { id: "2024203020029", name: "Muhammad Rais" }] },
        { name: "Kelompok VI", members: [{ id: "2024203020032", name: "Lunna Auamara" }, { id: "2024203020028", name: "Aqil Ocean Difra" }, { id: "2024203020036", name: "Nazar Al Farabi" }] },
      ],
    },
    "Teknik Gelombang Mikro": {
      dosen: "Munawar, S.T., M.T.",
      groups: [
        { name: "Kelompok I", members: [{ id: "2024203020019", name: "Khairul Fajar Sidiq" }, { id: "2024203020003", name: "Sarah Fonna" }, { id: "2024203020006", name: "Suheil Maulana" }, { id: "2024203020025", name: "Farhan Alfarsiyi" }] },
        { name: "Kelompok II", members: [{ id: "2024203020028", name: "Aqil Ocean Difra" }, { id: "2024203020001", name: "Ilal Ilhamdi" }, { id: "2024203020029", name: "Muhammad Rais" }, { id: "2024203020011", name: "Durratul Hikmah" }] },
        { name: "Kelompok III", members: [{ id: "2024203020035", name: "Afriansyah Sinamo" }, { id: "2024203020032", name: "Lunna Auamara" }, { id: "2024203020031", name: "Syawal Fitriyadi" }, { id: "2024203020022", name: "Muhammad Halfi Al Barizi" }] },
        { name: "Kelompok IV", members: [{ id: "2024203020036", name: "Nazar Al Farabi" }, { id: "2024203020009", name: "Firlita Afianti" }, { id: "2024203020008", name: "Rahmat Haikal" }] },
        { name: "Kelompok V", members: [{ id: "2024203020020", name: "Nesya Zikriya" }, { id: "2024203020016", name: "Renka Laura" }] },
      ],
    },
  },
  piket: [
    { name: "Kelompok Piket I", members: [{ id: "2024203020001", name: "Ilal Ilhamdi" }, { id: "2024203020022", name: "Muhammad Halfi Al Barizi" }, { id: "2024203020003", name: "Sarah Fonna" }, { id: "2024203020020", name: "Nesya Zikriya" }] },
    { name: "Kelompok Piket II", members: [{ id: "2024203020009", name: "Firlita Afianti" }, { id: "2024203020035", name: "Afriansyah Sinamo" }, { id: "2024203020011", name: "Durratul Hikmah" }, { id: "2024203020028", name: "Aqil Ocean Difra" }] },
    { name: "Kelompok Piket III", members: [{ id: "2024203020006", name: "Suheil Maulana" }, { id: "2024203020019", name: "Khairul Fajar Sidiq" }, { id: "2024203020036", name: "Nazar Al Farabi" }, { id: "2024203020016", name: "Renka Laura" }] },
    { name: "Kelompok Piket IV", members: [{ id: "2024203020031", name: "Syawal Fitriyadi" }, { id: "2024203020025", name: "Farhan Alfarsiyi" }, { id: "2024203020032", name: "Lunna Auamara" }, { id: "2024203020008", name: "Rahmat Haikal" }, { id: "2024203020029", name: "Muhammad Rais" }] },
  ],
  mahasiswa: [
    { no: 1, id: "2024203020013", name: "Afriansyah Sinamo" },
    { no: 2, id: "2024203020028", name: "Aqil Ocean Difra" },
    { no: 3, id: "2024203020011", name: "Durratul Hikmah" },
    { no: 4, id: "2024203020025", name: "Farhan Alfarsiyi" },
    { no: 5, id: "2024203020009", name: "Firlita Afianti" },
    { no: 6, id: "2024203020001", name: "Ilal Ilhamdi" },
    { no: 7, id: "2024203020019", name: "Khairul Fajar Sidiq" },
    { no: 8, id: "2024203020032", name: "Lunna Auamara" },
    { no: 9, id: "2024203020022", name: "Muhammad Halfi Al Barizi" },
    { no: 10, id: "2024203020029", name: "Muhammad Rais" },
    { no: 11, id: "2024203020036", name: "Nazar Al Farabi" },
    { no: 12, id: "2024203020020", name: "Nesya Zikriya" },
    { no: 13, id: "2024203020008", name: "Rahmat Haikal" },
    { no: 14, id: "2024203020016", name: "Renka Laura" },
    { no: 15, id: "2024203020003", name: "Sarah Fonna" },
    { no: 16, id: "2024203020006", name: "Suheil Maulana" },
    { no: 17, id: "2024203020031", name: "Syawal Fitriyadi" },
  ],
};

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const DAYS_KEY  = ["senin","selasa","rabu","kamis","jumat"];
const DAYS_FULL = ["Senin","Selasa","Rabu","Kamis","Jumat"];
const DAYS_SHORT= ["Sen","Sel","Rab","Kam","Jum"];
const JS_TO_IDX = { 1:0, 2:1, 3:2, 4:3, 5:4 }; // JS getDay() → index

// ─────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────
const titleCase = (s) =>
  s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const isLive = (jam, sel) => {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= toMinutes(jam) && cur <= toMinutes(sel);
};

const minutesUntil = (hhmm) => {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return toMinutes(hhmm) - cur;
};

const todayIdx = () => JS_TO_IDX[new Date().getDay()] ?? -1;

// ─────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("trjt-theme") || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("trjt-theme", theme);
  }, [theme]);
  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  return [theme, toggle];
}

function useNotification() {
  const notifiedRef = useRef(new Set());

  const checkAndNotify = useCallback((todayI) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const classes = DATA.jadwal[DAYS_KEY[todayI]] || [];
    classes.forEach((item) => {
      const diff = minutesUntil(item.jam);
      const key = `${item.mk}-${item.jam}`;
      if (diff > 0 && diff <= 15 && !notifiedRef.current.has(key)) {
        notifiedRef.current.add(key);
        new Notification(`⏰ Kelas mulai ${diff} menit lagi`, {
          body: `${titleCase(item.mk)} — ${item.ruang}, ${item.gedung}`,
          icon: "/favicon.png",
        });
      }
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported";
    const perm = await Notification.requestPermission();
    return perm;
  }, []);

  return { checkAndNotify, requestPermission };
}

// ─────────────────────────────────────────
//  ICONS (inline SVG components, a11y-friendly)
// ─────────────────────────────────────────
const Icon = ({ path, size = 20, label }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden={!label} aria-label={label}
    role={label ? "img" : undefined}
  >
    {path}
  </svg>
);

const Icons = {
  calendar:  <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  users:     <><circle cx="9" cy="7" r="4"/><path d="M2 21c0-4 3.1-7 7-7h2"/><circle cx="17" cy="9" r="3"/><path d="M14 21c0-3 2.1-5.5 5-5.5"/></>,
  shield:    <><path d="M3 6l9-4 9 4v6c0 4.5-4 8-9 9-5-1-9-4.5-9-9V6z"/><polyline points="9 12 11 14 15 10"/></>,
  file:      <><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></>,
  sun:       <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
  moon:      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
  download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  mapPin:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
};

// ─────────────────────────────────────────
//  EXPORT HELPERS
// ─────────────────────────────────────────
function downloadCSV(filename, rows) {
  const bom = "\uFEFF";
  const csv = bom + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─────────────────────────────────────────
//  STYLES (CSS-in-JS via <style> tag injected once)
// ─────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --radius: 10px;
  --radius-sm: 7px;
  --transition: .18s cubic-bezier(.4,0,.2,1);
}

[data-theme="light"] {
  --bg:        #f9f9fb;
  --bg2:       #ffffff;
  --bg3:       #f0f0f4;
  --line:      #e8e8ef;
  --line2:     #d0d0dc;
  --text:      #0c0c12;
  --text2:     #5a5a72;
  --text3:     #a0a0b8;
  --accent:    #3d5af1;
  --accent-bg: #eef1fe;
  --accent-hl: #2a46e0;
  --green:     #15a655;
  --green-bg:  #e8f8ef;
  --nav:       rgba(249,249,251,0.94);
  --shadow:    0 2px 16px rgba(0,0,0,.08);
}
[data-theme="dark"] {
  --bg:        #0e0e14;
  --bg2:       #16161f;
  --bg3:       #1e1e2a;
  --line:      #252535;
  --line2:     #323248;
  --text:      #eeeef8;
  --text2:     #8888a8;
  --text3:     #50506a;
  --accent:    #6b80f8;
  --accent-bg: #13163a;
  --accent-hl: #8090fc;
  --green:     #20c65e;
  --green-bg:  #0d2218;
  --nav:       rgba(10,10,16,0.96);
  --shadow:    0 2px 20px rgba(0,0,0,.35);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text);
  background: var(--bg);
  padding-bottom: 80px;
  -webkit-font-smoothing: antialiased;
  transition: background var(--transition), color var(--transition);
  min-height: 100dvh;
}

#root { max-width: 600px; margin: 0 auto; }

/* ── HEADER ── */
.hd {
  padding: 18px 20px 0;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 20;
  background: var(--bg);
  transition: background var(--transition);
}
.hd-inner {
  display: flex; align-items: center; gap: 10px;
}
.hd-brand {
  font-family: 'Syne', sans-serif;
  font-size: 17px; font-weight: 700; letter-spacing: -.01em;
  color: var(--text);
}
.hd-brand span { color: var(--accent); }
.hd-sem {
  font-size: 10px; font-weight: 600; color: var(--text3);
  background: var(--bg3); border: 1px solid var(--line);
  padding: 2px 8px; border-radius: 5px; letter-spacing: .04em;
  text-transform: uppercase;
}
.hd-right { display: flex; align-items: center; gap: 8px; }
.hd-clock {
  font-size: 12px; color: var(--text3);
  font-variant-numeric: tabular-nums;
  letter-spacing: .04em;
  background: var(--bg3); border: 1px solid var(--line);
  padding: 4px 10px; border-radius: 20px;
}
.icon-btn {
  width: 34px; height: 34px; border-radius: var(--radius-sm);
  border: 1px solid var(--line); background: var(--bg2);
  cursor: pointer; color: var(--text2);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--transition), border-color var(--transition), transform .1s;
  flex-shrink: 0;
}
.icon-btn:hover { background: var(--bg3); border-color: var(--line2); }
.icon-btn:active { transform: scale(.94); }
.icon-btn.active { color: var(--accent); border-color: var(--accent); background: var(--accent-bg); }

/* ── PAGE TITLE ── */
.pt {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--line);
}
.pt h1 {
  font-family: 'Syne', sans-serif;
  font-size: 24px; font-weight: 700; letter-spacing: -.03em;
  margin-bottom: 2px;
  transition: opacity .25s, transform .25s;
}
.pt p { font-size: 12px; color: var(--text3); }

/* ── WRAP ── */
.wrap { padding: 20px 20px 0; }

/* ── TAB TRANSITION ── */
.tab-panel {
  animation: fadeSlideIn .22s cubic-bezier(.4,0,.2,1) both;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── NOTIFICATION BANNER ── */
.notif-banner {
  display: flex; align-items: center; gap: 10px;
  background: var(--accent-bg); border: 1px solid var(--accent);
  border-radius: var(--radius); padding: 11px 14px;
  margin-bottom: 16px;
  animation: fadeSlideIn .2s ease both;
}
.notif-banner p { font-size: 13px; flex: 1; color: var(--text); }
.notif-banner strong { color: var(--accent); }
.notif-banner button {
  background: none; border: none; cursor: pointer;
  color: var(--text3); display: flex; padding: 2px;
  transition: color var(--transition);
}
.notif-banner button:hover { color: var(--text); }

/* ── DAY STRIP ── */
.days {
  display: flex; gap: 6px;
  overflow-x: auto; scrollbar-width: none; margin-bottom: 18px;
}
.days::-webkit-scrollbar { display: none; }
.day-btn {
  flex-shrink: 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600;
  padding: 7px 18px; border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: var(--bg2); color: var(--text2);
  cursor: pointer;
  transition: all var(--transition);
  letter-spacing: .01em;
}
.day-btn:hover { color: var(--text); border-color: var(--line2); background: var(--bg3); }
.day-btn.today { color: var(--accent); border-color: var(--accent); background: var(--accent-bg); }
.day-btn.selected { background: var(--accent); border-color: var(--accent); color: #fff; }

.day-meta {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.day-label {
  font-size: 11px; font-weight: 700; color: var(--text3);
  text-transform: uppercase; letter-spacing: .08em;
}
.day-count {
  font-size: 11px; color: var(--text3);
  background: var(--bg3); padding: 2px 8px; border-radius: 20px;
}

/* ── SCHEDULE ROWS ── */
.rows { display: flex; flex-direction: column; gap: 0; }

.schedule-row {
  display: grid; grid-template-columns: 56px 1fr auto;
  gap: 14px; align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  animation: fadeSlideIn .2s ease both;
}
.schedule-row:first-child { border-top: 1px solid var(--line); }
.schedule-row.live-row {
  background: linear-gradient(90deg, var(--green-bg) 0%, transparent 100%);
  margin: 0 -8px; padding-left: 8px; padding-right: 8px;
  border-radius: var(--radius-sm);
  border-color: transparent;
}
.schedule-row.live-row + .schedule-row { border-top: 1px solid var(--line); }

.r-time { display: flex; flex-direction: column; }
.r-time-start { font-size: 13px; font-weight: 700; letter-spacing: -.01em; }
.r-time-end { font-size: 11px; color: var(--text3); margin-top: 2px; }

.r-info {}
.r-mk {
  font-size: 14px; font-weight: 600; margin-bottom: 4px;
  display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  line-height: 1.3;
}
.r-dosen { font-size: 12px; color: var(--text2); }

.live-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; letter-spacing: .06em;
  color: var(--green); border: 1px solid var(--green);
  border-radius: 4px; padding: 2px 7px;
  background: var(--green-bg);
}
.live-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--green); animation: pulse 1.4s infinite;
  flex-shrink: 0;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }

.r-room { text-align: right; }
.r-room-name { font-size: 12px; font-weight: 700; }
.r-room-gd { font-size: 11px; color: var(--text3); margin-top: 2px; display: flex; align-items: center; gap: 3px; justify-content: flex-end; }

.upcoming-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600; color: var(--accent);
  background: var(--accent-bg); border: 1px solid var(--accent);
  border-radius: 4px; padding: 2px 7px; white-space: nowrap;
}

.empty-state {
  padding: 48px 0; text-align: center; color: var(--text3); font-size: 13px;
}
.empty-state svg { display: block; margin: 0 auto 10px; opacity: .35; }

/* ── SEARCH ── */
.search-wrap {
  position: relative; margin-bottom: 16px;
}
.search-input {
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  padding: 9px 14px 9px 38px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--bg2); color: var(--text);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.search-input::placeholder { color: var(--text3); }
.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--text3); pointer-events: none;
}
.clear-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--text3); display: flex; padding: 4px;
  transition: color var(--transition);
}
.clear-btn:hover { color: var(--text); }

/* ── MK TABS ── */
.mk-tabs {
  display: flex; gap: 6px; overflow-x: auto;
  scrollbar-width: none; margin-bottom: 10px;
}
.mk-tabs::-webkit-scrollbar { display: none; }
.mk-tab {
  flex-shrink: 0;
  font-family: 'DM Sans', sans-serif; white-space: nowrap;
  font-size: 12px; font-weight: 600;
  padding: 6px 16px; border-radius: var(--radius-sm);
  border: 1px solid var(--line); background: var(--bg2); color: var(--text2);
  cursor: pointer; transition: all var(--transition); letter-spacing: .01em;
}
.mk-tab:hover { color: var(--text); border-color: var(--line2); }
.mk-tab.selected { background: var(--accent); border-color: var(--accent); color: #fff; }

.mk-meta {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.mk-dosen { font-size: 12px; color: var(--text2); }
.mk-count { font-size: 12px; color: var(--text3); }

/* ── SECTION HEADER ── */
.section-hd {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.section-hd h2 {
  font-family: 'Syne', sans-serif;
  font-size: 16px; font-weight: 700; letter-spacing: -.02em;
}
.section-hd span { font-size: 12px; color: var(--text3); }
.export-btns { display: flex; gap: 6px; }

.export-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 600;
  padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer;
  border: 1px solid var(--line); background: var(--bg2); color: var(--text2);
  transition: all var(--transition); white-space: nowrap; letter-spacing: .01em;
}
.export-btn:hover { background: var(--bg3); color: var(--text); border-color: var(--line2); }
.export-btn:active { transform: scale(.96); }
.export-btn.csv:hover { border-color: var(--green); color: var(--green); }

/* ── GROUP GRID ── */
.group-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(188px, 1fr)); gap: 10px;
}

.group-card {
  border: 1px solid var(--line); border-radius: var(--radius);
  overflow: hidden; background: var(--bg2);
  transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
  animation: fadeSlideIn .2s ease both;
}
.group-card:hover {
  border-color: var(--line2);
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}
.group-card-head {
  padding: 10px 14px; background: var(--bg3);
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; justify-content: space-between;
}
.group-card-head b {
  font-family: 'Syne', sans-serif;
  font-size: 12px; font-weight: 700; color: var(--accent);
}
.group-card-head em { font-size: 11px; color: var(--text3); font-style: normal; }
.group-card-body { padding: 6px 14px 10px; }

.member-row {
  display: flex; align-items: baseline; gap: 9px;
  padding: 7px 0; border-bottom: 1px solid var(--line);
}
.member-row:last-child { border-bottom: none; }
.member-row.highlight { background: var(--accent-bg); margin: 0 -14px; padding-left: 14px; padding-right: 14px; border-radius: 0; }
.member-n { font-size: 11px; color: var(--text3); min-width: 14px; flex-shrink: 0; }
.member-info {}
.member-name { font-size: 13px; font-weight: 500; }
.member-id { font-size: 11px; color: var(--text3); margin-top: 1px; font-variant-numeric: tabular-nums; }
.no-result { text-align: center; color: var(--text3); font-size: 13px; padding: 32px 0; grid-column: 1/-1; }

/* ── TABLE ── */
.tbl-wrap { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
thead th {
  font-size: 11px; font-weight: 700; color: var(--text3);
  text-transform: uppercase; letter-spacing: .08em;
  padding: 10px 16px; text-align: left;
  background: var(--bg3); border-bottom: 1px solid var(--line);
}
tbody td {
  padding: 10px 16px; font-size: 13px;
  border-bottom: 1px solid var(--line); color: var(--text);
  transition: background var(--transition);
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: var(--bg3); }
tbody tr.highlight td { background: var(--accent-bg); }
.td-no { color: var(--text3); font-size: 12px; width: 28px; }
.td-id { color: var(--text2); font-size: 12px; font-variant-numeric: tabular-nums; }
.match-highlight { background: var(--accent); color: #fff; border-radius: 3px; padding: 0 2px; }

/* ── BOTTOM NAV ── */
nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--nav);
  border-top: 1px solid var(--line);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex; justify-content: center; z-index: 30;
}
.nav-inner {
  display: grid; grid-template-columns: repeat(4, 1fr);
  width: 100%; max-width: 600px;
}
.nav-btn {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
  padding: 10px 4px 14px;
  border: none; background: transparent; cursor: pointer;
  color: var(--text3); font-family: 'DM Sans', sans-serif;
  font-size: 10px; font-weight: 600; letter-spacing: .03em;
  transition: color var(--transition); text-transform: uppercase;
  position: relative;
}
.nav-btn.active { color: var(--accent); }
.nav-btn:hover:not(.active) { color: var(--text2); }
.nav-indicator {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 28px; height: 2.5px; border-radius: 0 0 3px 3px;
  background: var(--accent);
  transition: opacity var(--transition);
}

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 88px; left: 50%; transform: translateX(-50%);
  background: var(--text); color: var(--bg);
  font-size: 13px; font-weight: 500;
  padding: 10px 18px; border-radius: 20px;
  box-shadow: var(--shadow); z-index: 50;
  animation: toastIn .22s ease both;
  white-space: nowrap;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ── RESPONSIVE ── */
@media (max-width: 440px) {
  .schedule-row { grid-template-columns: 50px 1fr; }
  .r-room { text-align: left; grid-column: 2; margin-top: 4px; }
  .r-room-gd { justify-content: flex-start; }
  .group-grid { grid-template-columns: 1fr; }
  .pt h1 { font-size: 20px; }
}

/* ── FOCUS RING (a11y) ── */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
button:focus:not(:focus-visible) { outline: none; }

/* ── SKIP LINK (a11y) ── */
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--accent); color: #fff;
  padding: 8px 16px; z-index: 100;
  border-radius: 0 0 var(--radius) 0;
  font-size: 13px; font-weight: 600;
  transition: top .15s;
}
.skip-link:focus { top: 0; }
`;

// ─────────────────────────────────────────
//  HIGHLIGHT MATCH HELPER
// ─────────────────────────────────────────
function HighlightText({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="match-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─────────────────────────────────────────
//  TOAST COMPONENT
// ─────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2500);
    return () => clearTimeout(id);
  }, [onDone]);
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
}

// ─────────────────────────────────────────
//  TAB: JADWAL
// ─────────────────────────────────────────
function TabJadwal({ notifPerm, onRequestNotif }) {
  const [activeDay, setActiveDay] = useState(() => {
    const t = todayIdx();
    return t >= 0 ? t : 0;
  });
  const now = useClock();
  const todayI = todayIdx();

  const classes = DATA.jadwal[DAYS_KEY[activeDay]] || [];

  // Upcoming within 30 min (today only)
  const getUpcoming = (item) => {
    if (activeDay !== todayI) return null;
    const diff = minutesUntil(item.jam);
    if (diff > 0 && diff <= 30) return diff;
    return null;
  };

  return (
    <div className="tab-panel">
      {/* Notification prompt */}
      {notifPerm === "default" && (
        <div className="notif-banner" role="alert">
          <Icon path={Icons.bell} size={16} />
          <p>Aktifkan <strong>notifikasi</strong> agar dapat pengingat 15 menit sebelum kelas.</p>
          <button onClick={onRequestNotif} aria-label="Aktifkan notifikasi">
            <Icon path={Icons.bell} size={15} />
          </button>
        </div>
      )}

      {/* Day strip */}
      <div className="days" role="tablist" aria-label="Pilih hari">
        {DAYS_KEY.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeDay}
            className={`day-btn${i === todayI ? " today" : ""}${i === activeDay ? " selected" : ""}`}
            onClick={() => setActiveDay(i)}
          >
            {DAYS_SHORT[i]}
          </button>
        ))}
      </div>

      <div className="day-meta">
        <span className="day-label">{DAYS_FULL[activeDay]}</span>
        <span className="day-count">{classes.length} kelas</span>
      </div>

      <div className="rows" role="tabpanel">
        {classes.length === 0 ? (
          <div className="empty-state">
            <Icon path={Icons.calendar} size={32} />
            Tidak ada kelas hari ini.
          </div>
        ) : (
          classes.map((item, i) => {
            const live = activeDay === todayI && isLive(item.jam, item.sel);
            const upcoming = getUpcoming(item);
            return (
              <article
                key={i}
                className={`schedule-row${live ? " live-row" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
                aria-label={`${item.mk}, ${item.jam} sampai ${item.sel}`}
              >
                <div className="r-time">
                  <span className="r-time-start">{item.jam}</span>
                  <span className="r-time-end">{item.sel}</span>
                </div>
                <div className="r-info">
                  <div className="r-mk">
                    {titleCase(item.mk)}
                    {live && (
                      <span className="live-badge" aria-label="Sedang berlangsung">
                        <span className="live-dot" aria-hidden="true" />
                        Live
                      </span>
                    )}
                    {upcoming && !live && (
                      <span className="upcoming-badge">
                        <Icon path={Icons.clock} size={10} />
                        {upcoming}m lagi
                      </span>
                    )}
                  </div>
                  <div className="r-dosen">{item.dosen}</div>
                </div>
                <div className="r-room">
                  <div className="r-room-name">{item.ruang}</div>
                  <div className="r-room-gd">
                    <Icon path={Icons.mapPin} size={10} />
                    {item.gedung}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  TAB: KELOMPOK
// ─────────────────────────────────────────
function TabKelompok({ onToast }) {
  const mkList = Object.keys(DATA.kelompok);
  const [activeMK, setActiveMK] = useState(mkList[0]);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const mkData = DATA.kelompok[activeMK];

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return mkData.groups;
    const q = search.toLowerCase();
    return mkData.groups
      .map((g) => ({
        ...g,
        members: g.members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.id.includes(q)
        ),
      }))
      .filter((g) => g.members.length > 0);
  }, [search, mkData]);

  const handleExportCSV = () => {
    const rows = [["Mata Kuliah", "Dosen", "Kelompok", "No", "NIM", "Nama"]];
    Object.entries(DATA.kelompok).forEach(([mk, val]) => {
      val.groups.forEach((g) => {
        g.members.forEach((m, i) => rows.push([mk, val.dosen, g.name, i + 1, m.id, titleCase(m.name)]));
      });
    });
    downloadCSV("Kelompok_MK_TRJT2A.csv", rows);
    onToast("CSV berhasil diunduh ✓");
  };

  return (
    <div className="tab-panel">
      <div className="section-hd">
        <h2>Kelompok MK</h2>
        <div className="export-btns">
          <button className="export-btn csv" onClick={handleExportCSV} aria-label="Export CSV kelompok">
            <Icon path={Icons.download} size={13} />
            CSV
          </button>
        </div>
      </div>

      <div className="mk-tabs" role="tablist" aria-label="Pilih mata kuliah">
        {mkList.map((mk) => (
          <button
            key={mk} role="tab" aria-selected={mk === activeMK}
            className={`mk-tab${mk === activeMK ? " selected" : ""}`}
            onClick={() => { setActiveMK(mk); setSearch(""); }}
          >
            {mk}
          </button>
        ))}
      </div>

      <div className="mk-meta">
        <span className="mk-dosen">{mkData.dosen}</span>
        <span className="mk-count">{mkData.groups.length} kelompok</span>
      </div>

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true"><Icon path={Icons.search} size={15} /></span>
        <input
          ref={searchRef}
          className="search-input"
          type="search"
          placeholder="Cari nama atau NIM…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari anggota kelompok"
        />
        {search && (
          <button className="clear-btn" onClick={() => { setSearch(""); searchRef.current?.focus(); }} aria-label="Hapus pencarian">
            <Icon path={Icons.x} size={14} />
          </button>
        )}
      </div>

      <div className="group-grid" role="tabpanel">
        {filteredGroups.length === 0 ? (
          <p className="no-result">Tidak ada hasil untuk &quot;{search}&quot;</p>
        ) : (
          filteredGroups.map((g, gi) => (
            <div key={gi} className="group-card" style={{ animationDelay: `${gi * 0.04}s` }}>
              <div className="group-card-head">
                <b>{g.name}</b>
                <em>{g.members.length} orang</em>
              </div>
              <div className="group-card-body">
                {g.members.map((m, mi) => (
                  <div key={mi} className={`member-row${search && (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search)) ? " highlight" : ""}`}>
                    <span className="member-n">{mi + 1}</span>
                    <div className="member-info">
                      <div className="member-name">
                        <HighlightText text={titleCase(m.name)} query={search} />
                      </div>
                      <div className="member-id">
                        <HighlightText text={m.id} query={search} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  TAB: PIKET
// ─────────────────────────────────────────
function TabPiket({ onToast }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return DATA.piket;
    const q = search.toLowerCase();
    return DATA.piket
      .map((g) => ({ ...g, members: g.members.filter((m) => m.name.toLowerCase().includes(q) || m.id.includes(q)) }))
      .filter((g) => g.members.length > 0);
  }, [search]);

  const handleExportCSV = () => {
    const rows = [["Kelompok", "No", "NIM", "Nama"]];
    DATA.piket.forEach((p) => p.members.forEach((m, i) => rows.push([p.name, i + 1, m.id, titleCase(m.name)])));
    downloadCSV("Kelompok_Piket_TRJT2A.csv", rows);
    onToast("CSV berhasil diunduh ✓");
  };

  return (
    <div className="tab-panel">
      <div className="section-hd">
        <h2>Kelompok Piket</h2>
        <div className="export-btns">
          <button className="export-btn csv" onClick={handleExportCSV} aria-label="Export CSV piket">
            <Icon path={Icons.download} size={13} />
            CSV
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true"><Icon path={Icons.search} size={15} /></span>
        <input
          ref={searchRef}
          className="search-input"
          type="search"
          placeholder="Cari nama atau NIM…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari anggota piket"
        />
        {search && (
          <button className="clear-btn" onClick={() => { setSearch(""); searchRef.current?.focus(); }} aria-label="Hapus pencarian">
            <Icon path={Icons.x} size={14} />
          </button>
        )}
      </div>

      <div className="group-grid">
        {filteredGroups.length === 0 ? (
          <p className="no-result">Tidak ada hasil untuk &quot;{search}&quot;</p>
        ) : (
          filteredGroups.map((g, gi) => (
            <div key={gi} className="group-card" style={{ animationDelay: `${gi * 0.04}s` }}>
              <div className="group-card-head">
                <b>{g.name}</b>
                <em>{g.members.length} orang</em>
              </div>
              <div className="group-card-body">
                {g.members.map((m, mi) => (
                  <div key={mi} className={`member-row${search && (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search)) ? " highlight" : ""}`}>
                    <span className="member-n">{mi + 1}</span>
                    <div className="member-info">
                      <div className="member-name"><HighlightText text={titleCase(m.name)} query={search} /></div>
                      <div className="member-id"><HighlightText text={m.id} query={search} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  TAB: DAFTAR MAHASISWA
// ─────────────────────────────────────────
function TabDaftar({ onToast }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return DATA.mahasiswa;
    const q = search.toLowerCase();
    return DATA.mahasiswa.filter(
      (m) => m.name.toLowerCase().includes(q) || m.id.includes(q)
    );
  }, [search]);

  const handleExportCSV = () => {
    const rows = [["No", "NIM", "Nama"], ...DATA.mahasiswa.map((m) => [m.no, m.id, titleCase(m.name)])];
    downloadCSV("Daftar_Mahasiswa_TRJT2A.csv", rows);
    onToast("CSV berhasil diunduh ✓");
  };

  return (
    <div className="tab-panel">
      <div className="section-hd">
        <h2>Daftar Mahasiswa</h2>
        <div className="export-btns">
          <button className="export-btn csv" onClick={handleExportCSV} aria-label="Export CSV daftar mahasiswa">
            <Icon path={Icons.download} size={13} />
            CSV
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true"><Icon path={Icons.search} size={15} /></span>
        <input
          ref={searchRef}
          className="search-input"
          type="search"
          placeholder="Cari nama atau NIM…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari mahasiswa"
        />
        {search && (
          <button className="clear-btn" onClick={() => { setSearch(""); searchRef.current?.focus(); }} aria-label="Hapus pencarian">
            <Icon path={Icons.x} size={14} />
          </button>
        )}
      </div>

      {search && (
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
          {filtered.length} hasil ditemukan
        </p>
      )}

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">NIM</th>
              <th scope="col">Nama</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "var(--text3)", padding: "28px 0" }}>
                  Tidak ada hasil untuk &quot;{search}&quot;
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className={search && (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search)) ? "highlight" : ""}>
                  <td className="td-no">{m.no}</td>
                  <td className="td-id"><HighlightText text={m.id} query={search} /></td>
                  <td><HighlightText text={titleCase(m.name)} query={search} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────
const TABS = [
  { id: "jadwal",   label: "Jadwal",   title: "Jadwal Kelas",      icon: Icons.calendar },
  { id: "kelompok", label: "Kelompok", title: "Kelompok MK",       icon: Icons.users },
  { id: "piket",    label: "Piket",    title: "Kelompok Piket",    icon: Icons.shield },
  { id: "daftar",   label: "Daftar",   title: "Daftar Mahasiswa",  icon: Icons.file },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("jadwal");
  const [tabKey, setTabKey]       = useState(0); // forces re-mount for animation
  const [theme, toggleTheme]      = useTheme();
  const [toast, setToast]         = useState(null);
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const { checkAndNotify, requestPermission } = useNotification();
  const now = useClock();

  // Inject CSS once
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "trjt-styles";
    style.textContent = CSS;
    if (!document.getElementById("trjt-styles")) document.head.appendChild(style);
    return () => {};
  }, []);

  // Notification check every minute
  useEffect(() => {
    const ti = todayIdx();
    if (ti >= 0) checkAndNotify(ti);
  }, [now.getMinutes(), checkAndNotify]);

  const handleTabChange = (id) => {
    if (id === activeTab) return;
    setActiveTab(id);
    setTabKey((k) => k + 1);
  };

  const handleRequestNotif = async () => {
    const perm = await requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") showToast("Notifikasi aktif ✓");
  };

  const showToast = (msg) => {
    setToast(msg);
  };

  const clockStr = (() => {
    const p = (n) => String(n).padStart(2, "0");
    return `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  })();

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <>
      <a className="skip-link" href="#main-content">Lewati navigasi</a>

      {/* HEADER */}
      <header className="hd" role="banner">
        <div className="hd-inner">
          <div className="hd-brand">TRJT <span>2A</span></div>
          <div className="hd-sem">Semester 4</div>
        </div>
        <div className="hd-right">
          <time className="hd-clock" dateTime={clockStr} aria-label={`Jam sekarang ${clockStr}`}>
            {clockStr}
          </time>
          <button
            className={`icon-btn${notifPerm === "granted" ? " active" : ""}`}
            onClick={handleRequestNotif}
            aria-label={notifPerm === "granted" ? "Notifikasi aktif" : "Aktifkan notifikasi"}
            title="Notifikasi kelas"
          >
            <Icon path={Icons.bell} size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Ganti ke tema ${theme === "dark" ? "terang" : "gelap"}`}
            title="Ganti tema"
          >
            <Icon path={theme === "dark" ? Icons.sun : Icons.moon} size={16} />
          </button>
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="pt" role="heading" aria-level="1">
        <h1>{activeTabData?.title}</h1>
        <p>Teknologi Rekayasa Jaringan Telekomunikasi</p>
      </div>

      {/* MAIN CONTENT */}
      <main id="main-content" className="wrap">
        {activeTab === "jadwal" && (
          <TabJadwal key={tabKey} notifPerm={notifPerm} onRequestNotif={handleRequestNotif} />
        )}
        {activeTab === "kelompok" && (
          <TabKelompok key={tabKey} onToast={showToast} />
        )}
        {activeTab === "piket" && (
          <TabPiket key={tabKey} onToast={showToast} />
        )}
        {activeTab === "daftar" && (
          <TabDaftar key={tabKey} onToast={showToast} />
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav aria-label="Navigasi utama">
        <div className="nav-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn${activeTab === t.id ? " active" : ""}`}
              onClick={() => handleTabChange(t.id)}
              aria-current={activeTab === t.id ? "page" : undefined}
              aria-label={t.title}
            >
              {activeTab === t.id && <span className="nav-indicator" aria-hidden="true" />}
              <Icon path={t.icon} size={20} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* TOAST */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}