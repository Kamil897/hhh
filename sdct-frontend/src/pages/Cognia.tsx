import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Conversation = { id: string; title: string | null; model: 'phi3'|'gpt'|'llama'; teacher: 'math'|'history'|'languages'; };

type ConvDetail = Conversation & { messages: { id: string; role: 'user'|'assistant'|'system'; content: string; }[] };

export default function CogniaPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [active, setActive] = useState<ConvDetail | null>(null);
  const [model, setModel] = useState<'phi3'|'gpt'|'llama'>('phi3');
  const [teacher, setTeacher] = useState<'math'|'history'|'languages'>('math');
  const [message, setMessage] = useState('');

  async function loadList() {
    const r = await api.get('/cognia/conversations');
    setConvs(r.data);
  }

  async function loadConv(id: string) {
    const r = await api.get(`/cognia/conversations/${id}`);
    setActive(r.data);
  }

  async function createConv() {
    const r = await api.post('/cognia/conversations', { model, teacher, title: `${teacher} (${model})` });
    await loadList();
    await loadConv(r.data.id);
  }

  async function send() {
    if (!active || !message.trim()) return;
    await api.post(`/cognia/conversations/${active.id}/messages`, { content: message });
    setMessage('');
    await loadConv(active.id);
  }

  useEffect(() => { loadList(); }, []);

  return (
    <div className="container py-10 grid gap-4">
      <h1 className="text-3xl font-bold text-center">
        Cognia — ваш ассистент
        <span className="ml-2 align-middle" title="Защищено SDCT AES-256">🔒</span>
      </h1>

      <div className="card flex items-center gap-2">
        <select className="input w-auto" value={model} onChange={(e) => setModel(e.target.value as any)}>
          <option value="phi3">phi-3</option>
          <option value="gpt">GPT</option>
          <option value="llama">LLaMA</option>
        </select>
        <select className="input w-auto" value={teacher} onChange={(e) => setTeacher(e.target.value as any)}>
          <option value="math">математика</option>
          <option value="history">история</option>
          <option value="languages">английский</option>
        </select>
        <button className="btn btn-primary" onClick={createConv}>Новый диалог</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="font-semibold mb-2">Диалоги</div>
          <div className="grid gap-2">
            {convs.map((c) => (
              <button key={c.id} className={`text-left border rounded px-2 py-2 ${active?.id===c.id?'bg-blue-50':''}`} onClick={() => loadConv(c.id)}>
                <div className="text-sm">{c.title ?? `${c.teacher} (${c.model})`}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col space-y-2 bg-white rounded-lg p-4 h-[500px] overflow-y-auto">
              {!active ? (
                <div className="text-sm text-muted">Выберите диалог или создайте новый.</div>
              ) : (
                active.messages.map((m) => (
                  <div key={m.id} className={`${m.role==='user' ? 'self-end bg-primary text-white' : 'self-start bg-gray-200'} px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap`}>{m.content}</div>
                ))
              )}
            </div>
            <div className="flex items-start gap-2">
              <textarea className="input h-24" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ваш вопрос..." />
              <button className="btn btn-primary" onClick={send}>Отправить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}