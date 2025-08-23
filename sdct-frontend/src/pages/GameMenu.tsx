export default function GameMenu() {
  const games = [
    { name: 'Quiz Battle', desc: 'Викторина против друзей' },
    { name: 'Math Rush', desc: 'Решай примеры быстрее всех' },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Игры</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game, i) => (
          <div key={i} className="card flex flex-col items-center">
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <p className="text-muted mb-4">{game.desc}</p>
            <button className="btn btn-primary w-full">Играть</button>
          </div>
        ))}
      </div>
    </div>
  );
}