import { useEffect, useState } from 'react';

export default function QuizGame() {
  const question = {
    text: 'Столица Узбекистана?',
    answers: ['Бишкек', 'Ташкент', 'Алматы', 'Душанбе'],
  };

  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const progress = (timeLeft / 30) * 100;

  const leaderboard = [
    { name: 'Alice', score: 1200 },
    { name: 'Bob', score: 950 },
    { name: 'Eve', score: 800 },
  ];

  return (
    <div className="container py-10 grid gap-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Викторина (онлайн)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Chat */}
        <div className="card md:col-span-1 h-80 flex flex-col">
          <h2 className="font-semibold mb-2">Чат</h2>
          <div className="flex-1 overflow-auto space-y-1 text-sm">
            <div><span className="font-medium">Alice:</span> Поехали!</div>
            <div><span className="font-medium">Bob:</span> Готов!</div>
          </div>
          <div className="mt-2">
            <input className="input" placeholder="Сообщение..." />
          </div>
        </div>

        {/* Center: Question */}
        <div className="md:col-span-1">
          <div className="card w-full max-w-lg mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">{question.text}</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {question.answers.map((a, i) => (
                <button key={i} className="btn btn-secondary w-full">
                  {a}
                </button>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-muted mt-1">Осталось: {timeLeft}s</div>
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="card md:col-span-1">
          <h2 className="font-semibold mb-2">Таблица лидеров</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Игрок</th>
                <th className="py-2">Очки</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{player.name}</td>
                  <td className="py-2">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}