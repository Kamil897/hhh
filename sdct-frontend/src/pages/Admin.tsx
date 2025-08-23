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

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
        <button className="text-sm underline" onClick={load}>Refresh</button>
      </div>
      {items.map((c) => (
        <div key={c.id} className="border rounded p-3 bg-white">
          <div className="text-sm text-gray-600">{c.category} · {new Date(c.createdAt).toLocaleString()}</div>
          <div className="mt-1">{c.text}</div>
          <div className="mt-2 flex gap-2 text-sm">
            <span className="px-2 py-1 bg-gray-100 rounded">{c.status}</span>
            {c.status==='open' && (<>
              <button className="px-2 py-1 bg-emerald-600 text-white rounded" onClick={() => resolve(c.id)}>Resolve</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => reject(c.id)}>Reject</button>
            </>)}
          </div>
        </div>
      ))}
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
        <div key={u.id} className="border rounded p-3 bg-white flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">{u.email}</div>
            <div className="text-gray-600">role: {u.role} · points: {u.points} {u.isBanned && '· BANNED'} {u.isMuted && '· MUTED'}</div>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => ban(u.id)}>Ban</button>
            <button className="px-2 py-1 bg-yellow-600 text-white rounded" onClick={() => mute(u.id)}>Mute</button>
            <button className="px-2 py-1 bg-gray-700 text-white rounded" onClick={() => unban(u.id)}>Unban</button>
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
      <div className="bg-white border rounded p-3 grid gap-2">
        <div className="font-semibold">Create item</div>
        <div className="grid grid-cols-2 gap-2">
          <select className="border rounded px-2 py-1" value={draft.type} onChange={e=>setDraft({ ...draft, type: e.target.value })}>
            <option value="avatar">avatar</option>
            <option value="prefix">prefix</option>
            <option value="background">background</option>
          </select>
          <input className="border rounded px-2 py-1" placeholder="Name" value={draft.name} onChange={e=>setDraft({ ...draft, name: e.target.value })} />
          <input className="border rounded px-2 py-1" placeholder="Price" type="number" value={draft.price} onChange={e=>setDraft({ ...draft, price: Number(e.target.value) })} />
          <input className="border rounded px-2 py-1" placeholder="Value" value={draft.value} onChange={e=>setDraft({ ...draft, value: e.target.value })} />
          <input className="border rounded px-2 py-1 col-span-2" placeholder="Asset URL" value={draft.assetUrl} onChange={e=>setDraft({ ...draft, assetUrl: e.target.value })} />
        </div>
        <button className="self-start bg-blue-600 text-white rounded px-3 py-1 text-sm" onClick={create}>Create</button>
      </div>

      <div className="grid gap-2">
        {items.map((it) => (
          <div key={it.id} className="bg-white border rounded p-3 flex items-start justify-between">
            <div className="text-sm">
              <div className="font-medium">{it.name}</div>
              <div className="text-gray-600">{it.type} · {it.price} pts</div>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="px-2 py-1 bg-gray-700 text-white rounded" onClick={() => update(it.id, { isActive: !it.isActive })}>{it.isActive?'Disable':'Enable'}</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => remove(it.id)}>Delete</button>
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
    <div className="bg-white border rounded p-3 grid gap-2">
      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowPhi3} onChange={e=>setS({ ...s, allowPhi3: e.target.checked })} /> phi3</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowGpt} onChange={e=>setS({ ...s, allowGpt: e.target.checked })} /> GPT</label>
        <label className="flex items-center gap-1"><input type="checkbox" checked={!!s.allowLlama} onChange={e=>setS({ ...s, allowLlama: e.target.checked })} /> LLaMA</label>
      </div>
      <button className="self-start bg-blue-600 text-white rounded px-3 py-1 text-sm" onClick={save}>Save</button>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<'complaints'|'users'|'store'|'cognia'>('complaints');
  return (
    <div className="mt-6 grid gap-3">
      <div className="bg-white border rounded p-3 flex items-center gap-2 text-sm">
        <button className={`px-2 py-1 rounded ${tab==='complaints'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={() => setTab('complaints')}>Complaints</button>
        <button className={`px-2 py-1 rounded ${tab==='users'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={() => setTab('users')}>Users</button>
        <button className={`px-2 py-1 rounded ${tab==='store'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={() => setTab('store')}>Store</button>
        <button className={`px-2 py-1 rounded ${tab==='cognia'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={() => setTab('cognia')}>Cognia</button>
      </div>
      {tab==='complaints' && <ComplaintsTab />}
      {tab==='users' && <UsersTab />}
      {tab==='store' && <StoreTab />}
      {tab==='cognia' && <CogniaTab />}
    </div>
  );
}