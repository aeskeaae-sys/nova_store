import Link from "next/link";
import ProductCatalog, { type CatalogProduct } from "@/app/ProductCatalog";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadProducts(): Promise<CatalogProduct[]> {
  try {
    const result = await getPool().query(
      `SELECT type_id, name, image_url, price, price_vip, stock, category, details
       FROM gafiw_products
       WHERE stock >= 0
       ORDER BY stock DESC, name
       LIMIT 24`,
    );
    return result.rows.map((row) => ({
      type_id: String(row.type_id),
      name: String(row.name),
      image_url: typeof row.image_url === "string" ? row.image_url : null,
      price: Number(row.price),
      price_vip: Number(row.price_vip),
      stock: Number(row.stock),
      category: String(row.category),
      details: String(row.details ?? ""),
    }));
  } catch {
    return [];
  }
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex-shrink-0 text-lg font-extrabold tracking-tight text-slate-900">
          Nova<span className="text-[#d44242]">Store</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/" className="rounded-lg bg-[#FCE9E9] px-3 py-1.5 text-xs font-bold text-[#d44242] transition hover:bg-[#d44242] hover:text-white">
            หน้าแรก
          </Link>
          <Link href="/store" className="transition-colors hover:text-[#d44242]">สินค้า</Link>
          <Link href="#how-it-works" className="transition-colors hover:text-[#d44242]">วิธีใช้งาน</Link>
          <Link href="/admin/gafiw" className="transition-colors hover:text-[#d44242]">Admin</Link>
        </nav>
        <Link href="/store" className="rounded-lg bg-[#d44242] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#E87A7A]">
          เลือกสินค้า
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-extrabold text-white">
              Nova<span className="text-[#d44242]">Store</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              ร้านค้าสินค้าดิจิทัล เชื่อมข้อมูลจริงจาก GAFIW Shop
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">ลิงก์สำคัญ</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/store" className="hover:text-[#d44242]">สินค้าทั้งหมด</Link>
              <Link href="/admin/gafiw" className="hover:text-[#d44242]">GAFIW Admin</Link>
              <Link href="/admin/xnearby" className="hover:text-[#d44242]">xNearby Admin</Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">ระบบ</h2>
            <p className="mt-3 text-sm leading-relaxed">Catalog Sync · API Logs · Claim Management</p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-500">
          © 2026 Nova Store
        </div>
      </div>
    </footer>
  );
}

export default async function Home() {
  const products = await loadProducts();
  const categories = [...new Set(products.map((product) => product.category))].slice(0, 12);

  return (
    <>
      <Navbar />
      <main>
        <section className="relative flex min-h-[72vh] items-center overflow-hidden border-b border-slate-100 bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#d44242]/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#d44242]/5 blur-3xl" />
            <div className="absolute left-0 top-1/2 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl" />
          </div>
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d44242]/30 bg-[#d44242]/10 px-4 py-2 text-xs font-bold text-[#d44242]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d44242]" />
                GAFIW Catalog
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
                สินค้าดิจิทัล
                <br />
                <span className="text-[#d44242]">ราคาเหมาะสม</span>
                <br />
                ดูข้อมูลครบก่อนเลือก
              </h1>
              <p className="mx-auto mb-8 mt-6 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
                แสดงชื่อสินค้า รูป ราคา สต็อก และหมวดหมู่จาก GAFIW Product API ที่ซิงก์เข้าระบบ
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/store" className="rounded-2xl bg-[#d44242] px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#d44242]/25 transition hover:bg-[#E87A7A]">
                  เริ่มดูสินค้า →
                </Link>
                <Link href="/admin/gafiw" className="rounded-2xl border border-slate-200 bg-slate-100 px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
                  จัดการ GAFIW
                </Link>
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="overflow-hidden border-b border-slate-100 bg-white py-4">
            <div className="marquee-row mx-auto flex w-max gap-3">
              {[...categories, ...categories].map((category, index) => (
                <Link
                  key={`${category}-${index}`}
                  href="/store"
                  className="flex flex-shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-[#d44242]" />
                  {category}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="how-it-works" className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900">การใช้งานระบบ</h2>
              <p className="mt-2 text-sm text-slate-400">4 ขั้นตอนสำหรับผู้ดูแลและลูกค้า</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["01", "ตั้งค่า GAFIW", "กรอก API Key ผ่านหน้า Admin และเปิดใช้งานบริการ"],
                ["02", "ซิงก์สินค้า", "ดึงข้อมูลสินค้าจริงจาก GAFIW Product API"],
                ["03", "ดูและค้นหา", "เลือกหมวดหมู่ ค้นหา และเรียงราคาจากหน้าร้าน"],
              ].map(([number, title, description]) => (
                <div key={number} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:border-[#d44242]/40">
                  <span className="absolute right-6 top-5 text-5xl font-extrabold text-slate-200">{number}</span>
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#d44242]/10 text-lg font-black text-[#d44242]">
                    {number}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {products.length > 0 && (
          <section className="border-y border-slate-100 bg-slate-50 py-16">
            <div className="mx-auto max-w-6xl px-4">
              <div className="mb-8 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">สินค้าที่ซิงก์ล่าสุด</h2>
                  <p className="mt-1 text-sm text-slate-400">ข้อมูลจากฐานข้อมูล GAFIW</p>
                </div>
                <Link href="/store" className="text-sm font-semibold text-[#d44242] hover:underline">
                  ดูทั้งหมด →
                </Link>
              </div>
              <ProductCatalog products={products.slice(0, 8)} compact />
            </div>
          </section>
        )}

        <section className="bg-slate-50 px-4 py-16">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#d44242] to-[#9B1C1C] px-8 py-14 text-center">
            <h2 className="text-3xl font-extrabold text-white">พร้อมเปิดใช้งานระบบหรือยัง</h2>
            <p className="mb-7 mt-3 text-sm text-white/70">ตั้งค่า GAFIW และซิงก์รายการสินค้าเข้าระบบ</p>
            <Link href="/admin/gafiw" className="inline-block rounded-2xl bg-white px-8 py-3 text-sm font-extrabold text-[#d44242] shadow-lg transition hover:bg-slate-50">
              เปิด GAFIW Admin
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
