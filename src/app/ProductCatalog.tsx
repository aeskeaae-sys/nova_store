"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type CatalogProduct = {
  type_id: string;
  name: string;
  image_url: string | null;
  price: number;
  price_vip: number;
  stock: number;
  category: string;
  details: string;
};

export default function ProductCatalog({
  products,
  compact = false,
}: {
  products: CatalogProduct[];
  compact?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return products
      .filter((product) => category === "all" || product.category === category)
      .filter(
        (product) =>
          !query ||
          product.name.toLocaleLowerCase().includes(query) ||
          product.details.toLocaleLowerCase().includes(query),
      )
      .sort((a, b) =>
        sort === "price-asc"
          ? a.price - b.price
          : sort === "price-desc"
            ? b.price - a.price
            : a.name.localeCompare(b.name),
      );
  }, [products, search, category, sort]);

  return (
    <div className="space-y-4">
      {!compact && <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาสินค้า"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#d44242]"
          aria-label="ค้นหาสินค้า"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700" aria-label="Filter by category">
          <option value="all">หมวดหมู่ทั้งหมด</option>
          {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700" aria-label="Sort products">
          <option value="name">เรียงตามชื่อ</option>
          <option value="price-asc">ราคา: ต่ำ - สูง</option>
          <option value="price-desc">ราคา: สูง - ต่ำ</option>
        </select>
      </div>}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-400">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>
      ) : (
        <div className={compact ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"}>
          {visible.map((product) => (
            <article key={product.type_id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d44242]/40 hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">ไม่มีรูปสินค้า</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                    <span className="text-xs font-bold tracking-widest text-slate-500">สินค้าหมด</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#d44242]">{product.category}</p>
                <h2 className="mb-3 min-h-[2.5rem] line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-[#d44242]">{product.name}</h2>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-xl font-extrabold text-[#d44242]">฿{product.price_vip.toLocaleString("th-TH")}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {product.stock > 0 ? `เหลือ ${product.stock}` : "หมดแล้ว"}
                  </span>
                </div>
                {product.details && <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{product.details}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-zinc-500">
        ระบบแสดงรายการสินค้าเท่านั้น การสั่งซื้อยังเปิดใช้งานเมื่อเชื่อมบัญชีสมาชิกและระบบชำระเงินจริงครบถ้วน
      </p>
    </div>
  );
}
