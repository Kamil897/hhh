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
    <div className="mt-6 grid gap-4">
      <div className="bg-white border rounded p-3 flex items-center gap-2">
        <select className="border rounded px-2 py-1 text-sm" value={model} onChange={(e) => setModel(e.target.value as any)}>
          <option value="phi3">phi-3 (mock)</option>
          <option value="gpt">GPT (opt)</option>
          <option value="llama">LLaMA (opt)</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm" value={teacher} onChange={(e) => setTeacher(e.target.value as any)}>
          <option value="math">Математика</option>
          <option value="history">История</option>
          <option value="languages">Языки</option>
        </select>
        <button className="text-sm bg-blue-600 text-white rounded px-2 py-1" onClick={createConv}>Новый диалог</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-3">
          <div className="font-semibold mb-2">Диалоги</div>
          <div className="grid gap-2">
            {convs.map((c) => (
              <button key={c.id} className={`text-left border rounded px-2 py-2 ${active?.id===c.id?'bg-blue-50':''}`} onClick={() => loadConv(c.id)}>
                <div className="text-sm">{c.title ?? `${c.teacher} (${c.model})`}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded p-3 md:col-span-2">
          <div className="font-semibold mb-2">Чат</div>
          {!active ? <div className="text-sm text-gray-600">Выберите диалог или создайте новый.</div> : (
            <div className="grid gap-3">
              <div className="grid gap-2 max-h-96 overflow-auto">
                {active.messages.map((m) => (
                  <div key={m.id} className={`text-sm px-2 py-1 rounded ${m.role==='user'?'bg-blue-100':'bg-gray-100'}`}>{m.content}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="flex-1 border rounded px-3 py-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ваш вопрос..." />
                <button className="bg-blue-600 text-white rounded px-3 py-2" onClick={send}>Отправить</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}