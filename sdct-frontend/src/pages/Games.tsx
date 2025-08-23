import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { io, Socket } from 'socket.io-client';

function Quiz() {
  const [q, setQ] = useState<{ id: string; question: string; answers: string[] } | null>(null);
  const [res, setRes] = useState<string | null>(null);

  async function load() {
    const r = await api.get('/games/quiz');
    setQ(r.data);
    setRes(null);
  }
  useEffect(() => { load(); }, []);

  async function answer(idx: number) {
    if (!q) return;
    const r = await api.post('/games/quiz/answer', { id: q.id, answer: idx });
    setRes(r.data.correct ? `Верно! +${r.data.reward} баллов` : 'Неверно.');
  }

  return (
    <div className="card">
      <h2 className="font-semibold mb-2">Викторина</h2>
      {!q ? <div>Загрузка...</div> : (
        <div>
          <div className="mb-2">{q.question}</div>
          <div className="grid gap-2">
            {q.answers.map((a, i) => (
              <button key={i} className="btn w-full sm:w-auto border rounded px-3 py-2 text-left hover:bg-gray-50" onClick={() => answer(i)}>{a}</button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-700">{res}</div>
          <button className="mt-3 text-sm underline" onClick={load}>Новый вопрос</button>
        </div>
      )}
    </div>
  );
}

function RPS() {
  const [status, setStatus] = useState<string>('disconnected');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const socket: Socket | null = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const s = io('http://localhost:3000', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
    });
    return s;
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => setStatus('connected'));
    socket.on('rps:status', (payload) => setStatus(payload.status));
    socket.on('rps:paired', (p) => { setRoomId(p.roomId); setResult(null); setStatus('paired'); });
    socket.on('rps:roundResult', (r) => { setResult(r); setStatus('paired'); });
    return () => { socket.disconnect(); };
  }, [socket]);

  function join() {
    socket?.emit('rps:join');
  }

  function move(m: 'rock'|'paper'|'scissors') {
    if (!roomId) return;
    socket?.emit('rps:move', { roomId, move: m });
  }

  return (
    <div className="card">
      <h2 className="font-semibold mb-2">Камень-Ножницы-Бумага (онлайн)</h2>
      <div className="text-sm text-gray-600 mb-2">Статус: {status}</div>
      <div className="grid grid-cols-2 sm:flex gap-2 mb-2">
        <button className="btn w-full sm:w-auto border" onClick={join}>Найти соперника</button>
        <button className="btn w-full sm:w-auto border" onClick={() => move('rock')}>Камень</button>
        <button className="btn w-full sm:w-auto border" onClick={() => move('paper')}>Бумага</button>
        <button className="btn w-full sm:w-auto border" onClick={() => move('scissors')}>Ножницы</button>
      </div>
      {result && (
        <div className="text-sm">Раунд: A = {result.a}, B = {result.b}, Победитель: {result.winner}</div>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Quiz />
      <RPS />
    </div>
  );
}