import Link from "next/link";
import ProductCatalog, { type CatalogProduct } from "@/app/ProductCatalog";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadProducts(): Promise<CatalogProduct[]> {
  try {
    const result = await getPool().query(
      `SELECT type_id, name, image_url, price, price_vip, stock, category, details
       FROM gafiw_products ORDER BY name`,
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

export default async function StorePage() {
  const products = await loadProducts();
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <main className="min-h-screen bg-[#070c1b] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070c1b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1120px] items-center px-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Nova Store">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-xs font-black text-cyan-300">
              NS
            </span>
            <span className="text-[15px] font-bold tracking-wide text-white">NOVA STORE</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1.5 text-[12px] font-medium text-slate-300 lg:flex">
            <Link href="/" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05]">หน้าแรก</Link>
            <Link href="/store" className="rounded-md bg-cyan-400/10 px-3 py-2 text-cyan-300">ร้านค้า</Link>
            <Link href="/#promotion" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05]">โปรโมชั่น</Link>
            <Link href="/#history" className="rounded-md px-3 py-2 transition hover:bg-white/[0.05]">ประวัติ</Link>
          </nav>
          <Link href="/admin/gafiw" className="ml-3 rounded-md bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-500">
            ผู้ดูแลระบบ
          </Link>
        </div>
      </header>

      <section className="site-grid min-h-[calc(100vh-64px)] pb-12">
        <div className="mx-auto max-w-[760px] px-4 pt-8 sm:px-6">
          <h1 className="text-[20px] font-bold text-white">สินค้าทั้งหมด</h1>

          {categories.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["ทั้งหมด", ...categories.slice(0, 3)].map((category, index) => (
                <div
                  key={`${category}-${index}`}
                  className={index === 0
                    ? "rounded-[3px] border border-blue-500/80 bg-blue-500/[0.07] px-3 py-3"
                    : "rounded-[3px] border border-white/[0.07] bg-[#0b1124]/85 px-3 py-3"}
                >
                  <p className="text-[11px] font-bold text-slate-200">{category}</p>
                  <p className="mt-1 text-[9px] text-slate-500">{index === 0 ? `${products.length} รายการ` : "ดูรายการสินค้า"}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-100">หมวดหมู่สินค้า</h2>
              <span className="text-[9px] text-slate-500">{products.length} รายการ</span>
            </div>

            {products.length > 0 ? (
              <ProductCatalog products={products} />
            ) : (
              <div className="rounded-[3px] border border-white/[0.07] bg-[#0b1124]/85 p-8 text-center">
                <p className="text-[12px] text-slate-300">ยังไม่มีข้อมูลสินค้าถูกซิงก์</p>
                <Link href="/admin/gafiw" className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-[11px] font-bold text-white">
                  เปิดหน้าจัดการ
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] bg-[#070c1b] px-4 py-5 text-center text-[9px] text-slate-600">
        © 2026 NOVA STORE — ระบบสินค้า GAFIW
      </footer>
    </main>
  );
}
