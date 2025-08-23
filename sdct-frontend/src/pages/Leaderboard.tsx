const leaderboard = [
  { name: 'Alice', score: 1200 },
  { name: 'Bob', score: 950 },
  { name: 'Eve', score: 800 },
];

export default function Leaderboard() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Таблица лидеров</h1>
      <div className="card">
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
  );
}