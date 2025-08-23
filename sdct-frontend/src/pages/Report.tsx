import { useState } from 'react';
import { api } from '../lib/api';

export default function ReportPage() {
  const [category, setCategory] = useState('user');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post('/complaints', { category, text });
      setText('');
      setStatus('Thanks, your report was submitted.');
    } catch (e: any) {
      setStatus(e?.response?.data?.message ?? 'Failed to submit');
    }
  }

  return (
    <div className="mt-6 bg-white border rounded p-4 grid gap-3">
      <h1 className="font-semibold text-lg">Report an issue</h1>
      <form onSubmit={submit} className="grid gap-2">
        <select className="border rounded px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="user">User</option>
          <option value="content">Content</option>
          <option value="bug">Bug</option>
        </select>
        <textarea className="border rounded px-3 py-2" placeholder="Describe the issue..." rows={6} value={text} onChange={(e)=>setText(e.target.value)} />
        <button className="bg-blue-600 text-white rounded px-3 py-2">Submit</button>
      </form>
      {status && <div className="text-sm">{status}</div>}
    </div>
  );
}