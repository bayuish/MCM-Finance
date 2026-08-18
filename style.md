# Dokumentasi Style & Warna Project Frontend Bestrong 2

Dokumen ini berisi ekstraksi seluruh palet warna, desain komponen (Barometer/Odometer, Header, Sidebar, Cards, Tabel, dll.), serta variabel CSS yang digunakan pada project ini.

---

## 1. Barometer / Odometer (Hero Counter Widget)

Barometer adalah komponen display counter angka digital (Odometer) yang menampilkan total Rupiah dan KBM Pajak Kendaraan Bermotor.

### A. Container & Gradient Hero
- **Background Gradient Container**:
  ```css
  background: linear-gradient(90deg, #4a9b75, #1b43a4);
  ```
  *(Perpaduan Teal Green `#4a9b75` ke Royal Blue `#1b43a4`)*
- **Card Container Shadow & Radius**:
  - Radius: `var(--radius)` (`0.3rem` / `rounded-lg`)
  - Box Shadow: `0 1px 2.94px 0.06px rgba(4, 26, 55, 0.16)`
- **Teks Header Hero**:
  - Title: Warna White (`#ffffff`), `font-bold`, ukuran font `20px` - `40px`.
  - Subtitle (Waktu): Warna White (`#ffffff`), `font-bold`, ukuran font `12px` - `22px`.

### B. Desain Angka Digital (Barometer Odometer)
- **Font Family**: `'Arimo', monospace`
- **Frame Casing Luar (Hitam)**:
  - Background: `#000000` (Solid Black)
  - Border Radius: `0.34em`
  - Padding: `0.15em`
  - Warna Teks Default: `#eee0d3` (Cream / Off-White)

- **Kotak Digit Gelap (Angka Utama)**:
  - Background Linear Gradient:
    ```css
    linear-gradient(to bottom, #333333 0%, #333333 40%, #101010 60%, #333333 80%, #333333 100%)
    ```
  - Box Shadow Inset (Efek Cembung 3D): `inset 0 0 0.3em rgba(0, 0, 0, 0.8)`
  - Padding Digit: `0 0.15em`

- **Kotak Digit Terakhir (Aksen Terang / Putih-Krem)**:
  - Target Selector: `.odometer-digit:last-child`
  - Background Color: `#eee0d3` (Krem Terang)
  - Warna Angka Teks: `#000000` (Teks Hitam)
  - Linear Gradient:
    ```css
    linear-gradient(to bottom, #eee0d3 0%, #eee0d3 40%, #bbaa9a 60%, #eee0d3 80%, #eee0d3 100%)
    ```
  - Border Radius Sisi Kanan: `0 0.2em 0.2em 0`

- **Prefix & Suffix**:
  - Currency Prefix: `Rp ` (ditambahkan via `::before`)
  - Unit Suffix: ` KBM` (ditambahkan via `::after`)

---

## 2. Header (Navbar Atas)

- **Position & Sizing**:
  - Fixed Top: `top-0`, Height: `60px`, Z-Index: `z-[999]`
  - Shadow: `shadow-md`
- **Background**:
  ```css
  background: linear-gradient(90deg, #4a9b75, #1b43a4);
  ```
- **Logo**: `/images/logo-bapenda-3.png` (W: 120px, H: 20px)
- **Menu User / Profile Dropdown**:
  - Avatar Size: `w-10 h-10`
  - Header Item Profile: Background `#4a9b75`, Text White (`#ffffff`)
  - Dropdown Hover State: `hover:bg-primary` (`#1976d2`), Text White (`#ffffff`)

---

## 3. Sidebar (Navigasi Samping)

- **Position & Sizing**:
  - Fixed Left: `top-[60px]`, Height: `calc(100vh - 60px)`, Z-Index: `z-[99]`
  - Width Expanded: `260px`
  - Width Collapsed: `80px` (desktop) / `0px` (mobile)
- **Background**: `var(--background)` (`#ffffff` mode terang / `#1e293b` mode gelap)
- **Box Shadow**: `2px 0 2.94px .06px rgba(4, 26, 55, 0.16)`
- **Styling Item Menu**:
  - Warna Teks Normal: `text-accent-foreground` (`hsl(211, 65%, 15%)`), `font-semibold`
  - State Hover: `bg-blue-50` (`#eff6ff`), `text-blue-900` (`#1e3a8a`)
  - State Aktif Main Menu:
    - Background: `bg-blue-50` (`#eff6ff`)
    - Text: `text-primary` (`#1976d2`)
    - Indicator Bar Kiri: `before:w-1 before:h-full before:bg-primary`
  - State Aktif Sub Menu:
    - Text: `font-semibold text-primary` (`#1976d2`)
    - Indicator Dot: `before:w-2 before:h-2 before:rounded-full before:bg-primary`

---

## 4. Palet Warna Utama & CSS Variables

### A. Colors (Theme Tokens)
| Variable Name | HSL / Hex Code | Penggunaan Utama |
|---|---|---|
| `--primary` | `hsla(210, 79%, 46%, 1)` / `#1976d2` | Tombol utama, warna aktif menu, scrollbar thumb |
| `--secondary` | `hsla(210, 79%, 46%, 1)` | Warna sekunder |
| `--background` | `hsl(0, 0%, 100%)` / `#ffffff` | Background halaman & card (Light mode) |
| `--foreground` | `hsl(217.2, 32.6%, 17.5%)` | Warna teks utama |
| `--accent` | `hsl(210, 40%, 96.1%)` / `#f1f5f9` | Background kanvas utama aplikasi (`bg-accent`) |
| `--border` | `hsl(214.3, 31.8%, 91.4%)` / `#e2e8f0` | Border card & tabel |
| `--radius` | `0.3rem` | Border radius default |

### B. Gradients
- **`background__gradient`** (Header & Hero Barometer):
  `linear-gradient(90deg, #4a9b75, #1b43a4)`
- **`background__gradient-pab`** (Hero PAB):
  `linear-gradient(90deg, #ffc800, #ffb22c)`
- **`background__login`** (Halaman Login):
  `linear-gradient(45deg, #4099ff, #82bcff)`
- **`bg-danger`**:
  `linear-gradient(45deg, #ff5370, #ff869a)`
- **`bg-success`**:
  `linear-gradient(45deg, #4caf50, #81c784)`

### C. Status & Chart Indicator Dots
- Green Dot (`.dot_green`): `#1fb767`
- Yellow Dot (`.dot_yellow`): `#ffc800`
- Dot Tahun 2024 (`.dot_2024`): `#42f73d`
- Dot Tahun 2023 (`.dot_2023`): `#0000ff`
- Dot Target (`.dot_target`): `#ff0000`

---

## 5. Komponen Card & Tabel

### A. Base Card (`.base-card`)
```css
.base-card {
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: var(--background);
  box-shadow: 0 1px 2.94px 0.06px rgba(4, 26, 55, 0.16);
  transition: box-shadow 0.3s ease-in-out;
}
.base-card:hover {
  box-shadow: 0 4px 7px 1px rgba(4, 26, 55, 0.16);
}
```

### B. Base Table (`.base-table`)
```css
.base-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background);
}
.base-table tr:nth-child(odd) {
  background-color: #e0e8f2; /* Belang-belang selang-seling */
}
.base-table th, .base-table td {
  padding: 10px;
}
```
