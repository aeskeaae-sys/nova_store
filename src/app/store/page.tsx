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
    <main className="min-h-screen bg-slate-50 text-slate-700">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-extrabold text-slate-900">
            Nova<span className="text-[#d44242]">Store</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium sm:flex">
            <Link href="/" className="hover:text-[#d44242]">หน้าแรก</Link>
            <Link href="/store" className="rounded-lg bg-[#FCE9E9] px-3 py-1.5 text-xs font-bold text-[#d44242]">สินค้า</Link>
            <Link href="/admin/gafiw" className="hover:text-[#d44242]">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Nova<span className="text-[#d44242]">Store</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">สินค้าดิจิทัลจาก GAFIW API</p>
        </div>

        {categories.length > 0 && (
          <div className="mb-7 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <ProductCatalog products={products} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <p className="text-lg font-semibold text-slate-600">ไม่พบสินค้า</p>
            <p className="mt-2 text-sm text-slate-400">ซิงก์ข้อมูลจากหน้า GAFIW Admin เพื่อแสดงรายการสินค้า</p>
            <Link href="/admin/gafiw" className="mt-5 inline-block rounded-xl bg-[#d44242] px-5 py-2.5 text-sm font-bold text-white">
              เปิด GAFIW Admin
            </Link>
          </div>
        )}
      </section>

      <footer className="bg-slate-900 px-4 py-8 text-center text-xs text-slate-500">
        © 2026 NovaStore
      </footer>
    </main>
  );
}
