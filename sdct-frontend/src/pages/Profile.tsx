import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

type Profile = {
  id: string;
  email: string;
  nickname: string | null;
  prefix: string | null;
  avatarUrl: string | null;
  theme: string;
  points: number;
  achievements: { id: string; code: string; title: string }[];
  createdAt?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [form, setForm] = useState({ nickname: '', prefix: '', avatarUrl: '', theme: 'light' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [me, pu] = await Promise.all([
          api.get('/profile/me'),
          api.get('/profile/purchases'),
        ]);
        setProfile(me.data);
        setForm({
          nickname: me.data.nickname ?? '',
          prefix: me.data.prefix ?? '',
          avatarUrl: me.data.avatarUrl ?? '',
          theme: me.data.theme ?? 'light',
        });
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
      setEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to update');
    }
  }

  if (loading) return <div className="mt-10">Loading...</div>;
  if (error) return <div className="mt-10 text-red-600">{error}</div>;
  if (!profile) return null;

  const canEditAvatar = purchases.some((p: any) => !!p.assetUrl);
  const prefixOptions = ['', 'STUDENT', 'PRO', 'VIP', 'MASTER'];

  return (
    <div className="container py-10 grid gap-6">
      {/* Header */}
      <div className="card flex flex-col items-center text-center">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover mb-3" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-3" />
        )}
        <div className="text-xl font-bold">{form.prefix ? `[${form.prefix}] ` : ''}{profile.nickname || 'No nickname'}</div>
        <div className="text-sm text-muted">{profile.email}</div>
        {profile.createdAt && <div className="text-xs text-muted">С нами с {new Date(profile.createdAt).toLocaleDateString()}</div>}
        <div className="mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg" title="Защищено SDCT AES-256">SDCT Secure</div>
        <div className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">Баллы: {profile.points}</div>
      </div>

      {/* Achievements */}
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold">Достижения</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profile.achievements?.length ? profile.achievements.map((a) => (
            <div key={a.id} className="card flex flex-col items-center">
              <div className="text-sm font-medium">{a.title}</div>
              <div className="text-xs text-muted">{a.code}</div>
            </div>
          )) : <div className="text-sm text-gray-500">Нет достижений</div>}
        </div>
      </div>

      {/* Purchases */}
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold">Покупки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {purchases.length ? purchases.map((p) => (
            <div key={p.id} className="card">
              <div className="font-medium">{p.itemName}</div>
              <div className="text-sm text-muted">{p.itemId}</div>
            </div>
          )) : <div className="text-sm text-gray-500">Нет покупок</div>}
        </div>
      </div>

      {/* Edit toggle */}
      <div className="text-center">
        <Button variant="primary" onClick={() => setEditing((v) => !v)} className="w-full sm:w-auto">{editing ? 'Скрыть' : 'Редактировать профиль'}</Button>
      </div>

      {/* Edit section */}
      {editing && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-3">Редактирование профиля</h2>
          <form onSubmit={onSave} className="grid gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Никнейм" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
              <select className="input" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })}>
                {prefixOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt || 'Без префикса'}</option>
                ))}
              </select>
              <Input placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} disabled={!canEditAvatar} className="md:col-span-2" />
              <select className="input" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
              </select>
            </div>
            {!canEditAvatar && <div className="text-xs text-muted">Аватар доступен после покупки соответствующего предмета.</div>}
            <Button variant="primary" className="w-full sm:w-auto" type="submit">Сохранить</Button>
          </form>
        </div>
      )}
    </div>
  );
}