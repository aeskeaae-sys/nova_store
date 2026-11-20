import Link from "next/link";
import ProductCatalog, { type CatalogProduct } from "@/app/ProductCatalog";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadProducts(): Promise<CatalogProduct[]> {
  try {
    const result = await getPool().query(
      `SELECT type_id, name, image_url, price, price_vip, stock, category, details
       FROM gafiw_products
       ORDER BY synced_at DESC, name
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

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070c1b]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1120px] items-center px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Nova Store">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-xs font-black text-cyan-300">
            NS
          </span>
          <span className="text-[15px] font-bold tracking-wide text-white">NOVA STORE</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1.5 text-[12px] font-medium text-slate-300 lg:flex">
          <Link href="/" className="rounded-md px-3 py-2 text-slate-100 transition hover:bg-white/[0.05]">หน้าแรก</Link>
          <Link href="/store" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05] hover:text-white">ร้านค้า</Link>
          <Link href="#promotion" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05] hover:text-white">โปรโมชั่น</Link>
          <Link href="#history" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05] hover:text-white">ประวัติ</Link>
          <span className="ml-1 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-3 py-2 text-cyan-300">ค้นหา</span>
        </nav>

        <div className="ml-3 flex items-center gap-2">
          <button type="button" className="hidden h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.05] sm:flex" aria-label="สลับภาษา">TH</button>
          <Link href="/admin/gafiw" className="rounded-md bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500">
            ผู้ดูแลระบบ
          </Link>
        </div>
      </div>
    </header>
  );
}

export default async function Home() {
  const products = await loadProducts();
  const categories = [...new Set(products.map((product) => product.category))].slice(0, 4);

  return (
    <main className="min-h-screen bg-[#070c1b] text-slate-100">
      <Header />

      <section className="site-grid relative min-h-[calc(100vh-64px)] pb-10">
        <div className="mx-auto max-w-[760px] px-4 pt-7 sm:px-6">
          <div className="mx-auto mb-5 text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1 text-[11px] font-semibold text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              YUMART
            </div>
            <h1 className="text-[19px] font-bold text-white">ยินดีต้อนรับสู่ร้านเรา</h1>
            <p className="mt-1 text-[11px] text-slate-400">แหล่งรวมบริการดิจิทัลสำหรับคุณ</p>
          </div>

          <div className="relative mb-5 overflow-hidden rounded-[3px] border border-cyan-300/10 bg-gradient-to-r from-[#12366d] via-[#1b66b5] to-[#3b9aee] shadow-[0_16px_50px_rgba(30,100,180,.12)]">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,.05)_42%,transparent_43%)]" />
            <div className="relative flex min-h-[210px] items-center justify-center px-5 py-8 text-center">
              <div>
                <p className="text-[11px] text-cyan-100/80">บริการดิจิทัลครบวงจร</p>
                <h2 className="mt-2 text-xl font-black leading-tight text-white sm:text-3xl">
                  สินค้าออนไลน์คุณภาพ
                  <span className="block text-cyan-100">พร้อมบริการ 24 ชั่วโมง</span>
                </h2>
                <div className="mt-5 flex justify-center gap-2">
                  <Link href="#catalog" className="rounded-md bg-white/90 px-4 py-2 text-[11px] font-bold text-blue-950 transition hover:bg-white">
                    เลือกดูสินค้า
                  </Link>
                  <Link href="/store" className="rounded-md border border-white/25 px-4 py-2 text-[11px] font-bold text-white transition hover:bg-white/10">
                    ดูร้านค้า →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["สินค้า", String(products.length)],
              ["หมวดหมู่", String(categories.length)],
              ["ระบบ", "GAFIW"],
              ["ข้อมูล", products.length ? "ซิงก์แล้ว" : "รอซิงก์"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[3px] border border-white/[0.055] bg-[#0b1124]/85 px-3 py-3">
                <p className="text-[10px] text-slate-500">{label}</p>
                <p className="mt-1 text-[15px] font-bold text-cyan-400">{value}</p>
              </div>
            ))}
          </div>

          <section id="promotion" className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-slate-100">หมวดหมู่แนะนำ</h2>
              <Link href="/store" className="text-[10px] text-slate-500 hover:text-cyan-300">ดูทั้งหมด →</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(categories.length ? categories : ["ทั้งหมด", "สินค้าแนะนำ", "โปรโมชั่น", "อื่นๆ"]).map((category) => (
                <Link
                  key={category}
                  href="/store"
                  className="group relative h-[118px] overflow-hidden rounded-[3px] border border-white/[0.07] bg-gradient-to-br from-[#142a47] to-[#0c1830] p-3 transition hover:border-cyan-400/30"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,.16),transparent_35%)]" />
                  <span className="relative block text-[11px] font-bold text-slate-200">{category}</span>
                  <span className="relative mt-1 block text-[9px] text-slate-500">ดูรายการสินค้า</span>
                </Link>
              ))}
            </div>
          </section>

          <section id="catalog">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-slate-100">สินค้าแนะนำ</h2>
              <Link href="/store" className="text-[10px] text-slate-500 hover:text-cyan-300">ดูทั้งหมด →</Link>
            </div>
            {products.length ? (
              <ProductCatalog products={products.slice(0, 6)} compact />
            ) : (
              <div className="rounded-[3px] border border-white/[0.07] bg-[#0b1124]/85 p-5 text-center">
                <p className="text-[12px] text-slate-300">ยังไม่มีข้อมูลสินค้าถูกซิงก์</p>
                <Link href="/admin/gafiw" className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-[11px] font-bold text-white">
                  เปิดหน้าจัดการ
                </Link>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] bg-[#070c1b] px-4 py-5 text-center text-[9px] text-slate-600">
        © 2026 NOVA STORE — ระบบสินค้า GAFIW
      </footer>
    </main>
  );
}
