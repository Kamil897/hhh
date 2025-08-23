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
  const [filter, setFilter] = useState<'all' | Item['type']>('all');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get('/store/items');
      setItems(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load items');
    }
  }

  async function onPurchase(id: string) {
    try {
      setBusy(id);
      await api.post(`/store/purchase/${id}`);
      await load();
      alert('Purchased');
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Purchase failed');
    } finally {
      setBusy(null);
    }
  }

  async function donate(provider: 'stripe' | 'paypal') {
    const res = await api.post(`/payments/donate/${provider}`);
    if (res.data?.url) window.location.href = res.data.url;
  }

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  return (
    <div className="mt-6 grid gap-6">
      <div className="bg-white border rounded p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Store</h1>
          <div className="flex items-center gap-2">
            <select className="border rounded px-2 py-1 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="avatar">Avatars</option>
              <option value="prefix">Prefixes</option>
              <option value="background">Backgrounds</option>
            </select>
            <button className="text-sm bg-purple-600 text-white rounded px-2 py-1" onClick={() => donate('stripe')}>Donate (Stripe)</button>
            <button className="text-sm bg-yellow-500 text-white rounded px-2 py-1" onClick={() => donate('paypal')}>Donate (PayPal)</button>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>

      <div className="grid gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border rounded p-4 flex items-start justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">Type: {item.type}</div>
              {item.description && <div className="text-sm mt-1">{item.description}</div>}
              {!!item.assetUrl && item.type === 'avatar' && (
                <div className="text-xs text-gray-500 mt-1">Asset locked until purchase</div>
              )}
            </div>
            <div className="text-right">
              <div className="font-semibold">{item.price} pts</div>
              <button disabled={busy === item.id} className="mt-2 bg-blue-600 text-white rounded px-3 py-1 text-sm" onClick={() => onPurchase(item.id)}>
                {busy === item.id ? '...' : 'Buy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}