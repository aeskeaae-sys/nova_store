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
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          aria-label="ค้นหาสินค้า"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" aria-label="Filter by category">
          <option value="all">หมวดหมู่ทั้งหมด</option>
          {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" aria-label="Sort products">
          <option value="name">เรียงตามชื่อ</option>
          <option value="price-asc">ราคา: ต่ำ - สูง</option>
          <option value="price-desc">ราคา: สูง - ต่ำ</option>
        </select>
      </div>}

      {visible.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>
      ) : (
        <div className={compact ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"}>
          {visible.map((product) => (
            <article key={product.type_id} className="overflow-hidden rounded-[3px] border border-white/[0.07] bg-[#0b1124]">
              <div className="relative aspect-[4/3] bg-[#10182c]">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                ) : <div className="flex h-full items-center justify-center text-sm text-zinc-500">No image</div>}
              </div>
              <div className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[11px] font-bold leading-tight text-slate-100">{product.name}</h2>
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] text-cyan-300 bg-cyan-400/10">{product.category}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-100">฿{product.price.toLocaleString("th-TH")}</span>
                  <span className="text-[9px] text-slate-500">VIP ฿{product.price_vip.toLocaleString("th-TH")}</span>
                </div>
                <p className="text-xs text-zinc-400">Stock: {product.stock}</p>
                {product.details && <p className="line-clamp-4 whitespace-pre-line text-sm text-zinc-400">{product.details}</p>}
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
