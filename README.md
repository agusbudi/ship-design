# ShipDesign Scheduler

Aplikasi manajemen penjadwalan desain kapal berbasis **Product-Oriented Design Process**.

## Struktur Folder

```
shipdesign/
├── index.html              ← Halaman utama / splash screen
├── css/
│   └── style.css           ← Shared styles (light & dark mode)
├── js/
│   └── data.js             ← Data deliverable & shared utilities
└── pages/
    ├── tree.html           ← Hierarchy tree view
    ├── gantt.html          ← Gantt chart timeline
    ├── kanban.html         ← Kanban board
    └── dashboard.html      ← Dashboard & statistik
```

## Cara Membuka

Cukup buka file `index.html` di browser (Chrome, Firefox, Edge, Safari).
Tidak perlu server — semua berjalan lokal.

## Fitur

| Halaman | Fitur |
|---|---|
| **Hierarchy tree** | Struktur lengkap desain kapal, expand/collapse, klik item untuk ganti status via panel kanan |
| **Gantt chart** | Timeline 4 fase (Jan–Des), filter per fase |
| **Kanban board** | Kolom To do / In progress / Done / Overdue, filter fase & kategori, klik kartu untuk detail |
| **Dashboard** | Statistik keseluruhan, progress bar per fase, breakdown kategori, bar chart, aktivitas terbaru |

## Data

Semua deliverable bersumber dari:
- `Basic_Design_Item_list_Ship_production.xlsx`
- `Product-Oriented_Design_Process.pdf`

**4 fase:** Concept Design, Preliminary Design, Contract Design, Functional Design  
**5 kategori:** Hull, Machinery, Electrical, HVAC, Production  
**150+ deliverable** item

## Status Item

Status dapat diubah langsung di semua halaman:
- **To do** — belum dimulai
- **In progress** — sedang berjalan
- **Done** — selesai
- **Overdue** — terlambat

Status tersimpan di `sessionStorage` sehingga konsisten antar halaman selama sesi browser.
