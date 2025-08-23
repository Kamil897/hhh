import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Profile = {
  id: string;
  email: string;
  nickname: string | null;
  prefix: string | null;
  avatarUrl: string | null;
  theme: string;
  points: number;
  achievements: { id: string; code: string; title: string }[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [form, setForm] = useState({ nickname: '', prefix: '', avatarUrl: '', theme: 'light' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [me, tx, pu] = await Promise.all([
          api.get('/profile/me'),
          api.get('/profile/transactions'),
          api.get('/profile/purchases'),
        ]);
        setProfile(me.data);
        setForm({
          nickname: me.data.nickname ?? '',
          prefix: me.data.prefix ?? '',
          avatarUrl: me.data.avatarUrl ?? '',
          theme: me.data.theme ?? 'light',
        });
        setTransactions(tx.data);
        setPurchases(pu.data);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.put('/profile/me', form);
      setProfile(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to update');
    }
  }

  if (loading) return <div className="mt-10">Loading...</div>;
  if (error) return <div className="mt-10 text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <div className="mt-6 grid gap-6">
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Profile</h2>
        <form onSubmit={onSave} className="grid gap-3">
          <div className="flex items-center gap-3">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200" />
            )}
            <div>
              <div className="text-sm text-gray-600">{profile.email}</div>
              <div className="text-base font-medium">{form.prefix ? `[${form.prefix}] ` : ''}{form.nickname || 'No nickname'}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Nickname" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Prefix" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} />
            <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
            <select className="border rounded px-3 py-2" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="font-medium">Points:</div>
            <div>{profile.points}</div>
          </div>
          <button className="self-start bg-blue-600 text-white rounded px-3 py-2">Save</button>
        </form>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Achievements</h2>
        <div className="flex flex-wrap gap-2">
          {profile.achievements?.length ? profile.achievements.map((a) => (
            <span key={a.id} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{a.title}</span>
          )) : <div className="text-sm text-gray-500">No achievements yet</div>}
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Purchases</h2>
        <div className="grid gap-2">
          {purchases.length ? purchases.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{p.itemName}</div>
                <div className="text-gray-600">{p.itemId}</div>
              </div>
              {p.assetUrl && (
                <a className="text-blue-600 underline" href={`/api/profile/asset?itemId=${encodeURIComponent(p.itemId)}`}>Open</a>
              )}
            </div>
          )) : <div className="text-sm text-gray-500">No purchases yet</div>}
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Transactions</h2>
        <div className="grid gap-2">
          {transactions.length ? transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <div className="text-gray-600">{t.type}</div>
              <div className={t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}>{t.amount >= 0 ? `+${t.amount}` : t.amount}</div>
            </div>
          )) : <div className="text-sm text-gray-500">No transactions yet</div>}
        </div>
      </div>
    </div>
  );
}