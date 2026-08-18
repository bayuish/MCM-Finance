Plan & Architecture: User Route Structure Analysis & New Base Project
Analysis of the routing and user access control pattern in frontend-bestrong-2, followed by the creation of a new React base project implementing this exact structure.

1. Analisis Struktur Route & User di frontend-bestrong-2
Berdasarkan analisis file di project frontend-bestrong-2:

src/routes.tsx: Menyiapkan array routes ber tipe TRoute[] dan fungsi renderRoutes(). Setiap route mendefinisikan path, element (Lazy component via React.lazy), guard (GuestGuard / AuthGuard), layout (Layout utama), dan role ("all", "admin", "p3d", atau array of roles).
src/components/auth/AuthGuard.tsx: Memeriksa status isLoggedIn. Jika belum login, redirect ke /login. Jika sudah login, memanggil RolesGuard({ role }). Jika role tidak diizinkan, redirect ke /404.
src/components/auth/GuestGuard.tsx: Memeriksa status isLoggedIn. Jika sudah login, redirect ke halaman utama /.
src/components/auth/RolesGuard.tsx: Memeriksa role pengguna saat ini (dari local storage / AuthContext) terhadap role yang diizinkan pada route.
src/layout/Sidebar/index.tsx & src/utils/menuItems.ts: Sidebar secara dinamis menyaring menu item berdasarkan role user yang sedang aktif.
src/contexts/AuthContext.tsx: Menyimpan state autentikasi (isLoggedIn, user, login, logout).
2. Proposed Changes for New Base Project (base-project)
Kita akan membuat project base baru (misal folder base-project) yang mengadopsi struktur persis di atas dengan penyesuaian role Owner dan Admin.

File & Project Structure
base-project/
package.json & vite.config.ts (React + TypeScript + Vite + Tailwind CSS + Lucide Icons)
src/
types/auth.ts (Tipe data User, Role "owner" | "admin", TRoute)
contexts/AuthContext.tsx (Auth Provider & Switcher Role Owner/Admin)
hooks/useAuth.ts
components/
auth/GuestGuard.tsx
auth/AuthGuard.tsx
auth/RolesGuard.tsx
loader/index.tsx
layout/
index.tsx (Main Layout dengan Header Navbar & Content Area)
Sidebar/index.tsx (Sidebar navigasi dinamis berfilter role)
UserMenu.tsx (Profil menu & tombol logout/switch role)
utils/menuItems.ts (Daftar menu sidebar dengan role filter: "owner", "admin", "all")
routes.tsx (Definisi routes dan fungsi renderRoutes)
pages/
login/index.tsx (Halaman login sederhana untuk memilih role Owner / Admin)
home/index.tsx (Halaman Home utama)
not-found/index.tsx (Halaman 404 / Access Denied)
App.tsx & main.tsx
3. User Review Required
NOTE

Project baru akan dibuat di dalam directory base-project di folder kerja pengguna (frontend-bestrong-2/base-project). Menggunakan 2 role pengguna: Owner dan Admin.

4. Verification Plan
Manual Verification
Jalankan npm run dev pada directory base-project.
Buka aplikasi di browser.
Uji alur halaman /login:
Pilih login sebagai Owner -> Masuk ke Home (/), Sidebar menampilkan menu Owner & All.
Pilih login sebagai Admin -> Masuk ke Home (/), Sidebar menampilkan menu Admin & All.
Uji AuthGuard & RolesGuard:
Coba akses URL tanpa login -> Di-redirect ke /login.
Coba akses URL terlarang -> Di-redirect ke /404.
Uji toggle Sidebar (collapse & expand).
