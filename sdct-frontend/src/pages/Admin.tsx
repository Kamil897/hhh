import { useEffect, useState } from 'react';
import { api } from '../lib/api';

function ComplaintsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState<'open'|'resolved'|'rejected'|'all'>('open');

  async function load() {
    const res = await api.get('/complaints', { params: status==='all'?{}:{ status } });
    setItems(res.data);
  }
  useEffect(() => { load(); }, [status]);

  async function resolve(id: string) { await api.post(`/complaints/${id}/resolve`); load(); }
  async function reject(id: string) { await api.post(`/complaints/${id}/reject`); load(); }
  async function ban(userId?: string) { if (!userId) return; await api.post(`/admin/users/${userId}/ban`); load(); }
  async function mute(userId?: string) { if (!userId) return; await api.post(`/admin/users/${userId}/mute`); load(); }
  async function unban(userId?: string) { if (!userId) return; await api.post(`/admin/users/${userId}/unban`); load(); }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="open">Открытые</option>
          <option value="resolved">Решённые</option>
          <option value="rejected">Отклонённые</option>
          <option value="all">Все</option>
        </select>
        <button className="text-sm underline" onClick={load}>Обновить</button>
      </div>
      <div className="card">
        <table className="table-auto w-full border">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-2 text-left">От кого</th>
              <th className="py-2 px-2 text-left">На кого</th>
              <th className="py-2 px-2 text-left">Текст</th>
              <th className="py-2 px-2 text-left">Статус</th>
              <th className="py-2 px-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b align-top">
                <td className="py-2 px-2 text-sm">{c.author?.email ?? '—'}</td>
                <td className="py-2 px-2 text-sm">—</td>
                <td className="py-2 px-2 text-sm whitespace-pre-wrap">{c.text}</td>
                <td className="py-2 px-2 text-sm">{c.status}</td>
                <td className="py-2 px-2 text-sm space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-danger" onClick={() => ban(c.author?.id)}>Забанить</button>
                    <button className="btn btn-secondary" onClick={() => mute(c.author?.id)}>Мут</button>
                    <button className="btn" onClick={() => unban(c.author?.id)}>Разбанить</button>
                  </div>
                  {c.status==='open' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button className="btn btn-primary" onClick={() => resolve(c.id)}>Закрыть (решено)</button>
                      <button className="btn" onClick={() => reject(c.id)}>Отклонить</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  async function load() { const r = await api.get('/admin/users'); setUsers(r.data); }
  useEffect(() => { load(); }, []);
  async function ban(id: string) { await api.post(`/admin/users/${id}/ban`); load(); }
  async function mute(id: string) { await api.post(`/admin/users/${id}/mute`); load(); }
  async function unban(id: string) { await api.post(`/admin/users/${id}/unban`); load(); }

  return (
    <div className="grid gap-2">
      {users.map((u) => (
        <div key={u.id} className="card flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">{u.email}</div>
            <div className="text-muted">роль: {u.role} · баллы: {u.points} {u.isBanned && '· ЗАБАНЕН'} {u.isMuted && '· МУТ'}</div>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="btn btn-danger" onClick={() => ban(u.id)}>Забанить</button>
            <button className="btn btn-secondary" onClick={() => mute(u.id)}>Мут</button>
            <button className="btn" onClick={() => unban(u.id)}>Разбанить</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StoreTab() {
  const [items, setItems] = useState<any[]>([]);
  const [draft, setDraft] = useState<any>({ type: 'avatar', name: '', price: 0, value: '', assetUrl: '', isActive: true });
  async function load() { const r = await api.get('/admin/store/items'); setItems(r.data); }
  useEffect(() => { load(); }, []);
  async function create() { await api.post('/admin/store/items', draft); setDraft({ type: 'avatar', name: '', price: 0, value: '', assetUrl: '', isActive: true }); load(); }
  async function update(id: string, body: any) { await api.put(`/admin/store/items/${id}`, body); load(); }
  async function remove(id: string) { await api.delete(`/admin/store/items/${id}`); load(); }

  return (
    <div className="grid gap-3">
      <div className="card grid gap-2">
        <div className="font-semibold">Создать товар</div>
        <div className="grid grid-cols-2 gap-2">
          <select className="input" value={draft.type} onChange={e=>setDraft({ ...draft, type: e.target.value })}>
            <option value="avatar">avatar</option>
            <option value="prefix">prefix</option>
            <option value="background">background</option>
          </select>
          <input className="input" placeholder="Название" value={draft.name} onChange={e=>setDraft({ ...draft, name: e.target.value })} />
          <input className="input" placeholder="Цена" type="number" value={draft.price} onChange={e=>setDraft({ ...draft, price: Number(e.target.value) })} />
          <input className="input" placeholder="Value" value={draft.value} onChange={e=>setDraft({ ...draft, value: e.target.value })} />
          <input className="input col-span-2" placeholder="Asset URL" value={draft.assetUrl} onChange={e=>setDraft({ ...draft, assetUrl: e.target.value })} />
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={create}>Создать</button>
      </div>

      <div className="grid gap-2">
        {items.map((it) => (
          <div key={it.id} className="card flex items-start justify-between">
            <div className="text-sm">
              <div className="font-medium">{it.name}</div>
              <div className="text-muted">{it.type} · {it.price} pts</div>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="btn" onClick={() => update(it.id, { isActive: !it.isActive })}>{it.isActive?'Выключить':'Включить'}</button>
              <button className="btn btn-danger" onClick={() => remove(it.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CogniaTab() {
  const [s, setS] = useState<any>({ allowPhi3: true, allowGpt: false, allowLlama: false });
  async function load() { const r = await api.get('/admin/cognia/settings'); setS(r.data); }
  useEffect(() => { load(); }, []);
  async function save() { await api.put('/admin/cognia/settings', s); load(); }
  return (
    <div className="card grid gap-2">
      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowPhi3} onChange={e=>setS({ ...s, allowPhi3: e.target.checked })} /> phi3</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowGpt} onChange={e=>setS({ ...s, allowGpt: e.target.checked })} /> GPT</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowLlama} onChange={e=>setS({ ...s, allowLlama: e.target.checked })} /> LLaMA</label>
      </div>
      <button className="btn btn-primary w-full sm:w-auto" onClick={save}>Сохранить</button>
    </div>
  );
}

function SettingsTab() {
  // Пример статистики (можно заменить на реальные данные)
  const stats = [
    { label: 'Пользователей', value: 1200 },
    { label: 'Активных игр', value: 14 },
    { label: 'AI-запросов', value: 3200 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="card flex flex-col items-center">
          <div className="text-3xl font-bold">{s.value}</div>
          <div className="text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<'users'|'complaints'|'store'|'cognia'|'settings'>('complaints');
  return (
    <div className="mt-6 grid gap-3">
      <div className="card flex items-center gap-2 text-sm">
        <button className={`px-2 py-1 rounded ${tab==='users'?'btn btn-primary':'btn'}`} onClick={() => setTab('users')}>Пользователи</button>
        <button className={`px-2 py-1 rounded ${tab==='complaints'?'btn btn-primary':'btn'}`} onClick={() => setTab('complaints')}>Жалобы</button>
        <button className={`px-2 py-1 rounded ${tab==='store'?'btn btn-primary':'btn'}`} onClick={() => setTab('store')}>Магазин</button>
        <button className={`px-2 py-1 rounded ${tab==='cognia'?'btn btn-primary':'btn'}`} onClick={() => setTab('cognia')}>Cognia</button>
        <button className={`px-2 py-1 rounded ${tab==='settings'?'btn btn-primary':'btn'}`} onClick={() => setTab('settings')}>Настройки</button>
      </div>
      {tab==='users' && <UsersTab />}
      {tab==='complaints' && <ComplaintsTab />}
      {tab==='store' && <StoreTab />}
      {tab==='cognia' && <CogniaTab />}
      {tab==='settings' && <SettingsTab />}
    </div>
  );
}