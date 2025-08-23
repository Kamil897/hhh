import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Item {
  id: string;
  type: 'avatar' | 'prefix' | 'background';
  name: string;
  description?: string;
  price: number;
  value?: string | null;
  assetUrl?: string | null;
}

export default function StorePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<'avatar' | 'prefix' | 'background'>('avatar');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    load();
    loadPurchases();
  }, []);

  async function load() {
    try {
      const res = await api.get('/store/items');
      setItems(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load items');
    }
  }

  async function loadPurchases() {
    try {
      const r = await api.get('/profile/purchases');
      setPurchases(r.data);
    } catch {}
  }

  async function onPurchase(id: string) {
    try {
      setBusy(id);
      await api.post(`/store/purchase/${id}`);
      await Promise.all([load(), loadPurchases()]);
      alert('Purchased');
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Purchase failed');
    } finally {
      setBusy(null);
    }
  }

  async function onUse(id: string) {
    try {
      setBusy(id);
      await api.post(`/store/use/${id}`);
      alert('Applied');
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Apply failed');
    } finally {
      setBusy(null);
    }
  }

  const owned = new Set(purchases.map((p) => p.itemId));
  const filtered = items.filter((i) => i.type === filter);

  return (
    <div className="container py-10 grid gap-6">
      <h1 className="text-3xl font-bold mb-6">Магазин</h1>

      {/* Tabs */}
      <div className="card flex flex-wrap items-center gap-2">
        {(['avatar','prefix','background'] as const).map((t) => (
          <button key={t} className={`btn ${filter===t?'btn-primary':'btn-secondary'}`} onClick={() => setFilter(t)}>
            {t === 'avatar' ? 'Аватары' : t === 'prefix' ? 'Префиксы' : 'Фоны'}
          </button>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="card flex flex-col gap-3">
            {/* Preview */}
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {item.type === 'avatar' && item.assetUrl ? (
                <img src={item.assetUrl} alt={item.name} className="h-full object-cover" />
              ) : (
                <span className="text-muted text-sm">Preview</span>
              )}
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-muted">{item.type}</div>
            </div>
            {/* Price + Action */}
            <div className="flex items-center justify-between">
              <div className="font-semibold">💎 {item.price}</div>
              {owned.has(item.id) ? (
                <button disabled={busy === item.id} className="btn btn-primary w-full sm:w-auto" onClick={() => onUse(item.id)}>Использовать</button>
              ) : (
                <button disabled={busy === item.id} className="btn btn-secondary w-full sm:w-auto" onClick={() => onPurchase(item.id)}>Купить</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}