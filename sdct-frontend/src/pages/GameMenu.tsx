import { Link } from 'react-router-dom';

export default function GameMenu() {
  const games = [
    { name: 'Quiz Battle', desc: 'Викторина против друзей', to: '/games/quiz' },
    { name: 'Math Rush', desc: 'Решай примеры быстрее всех', to: '/games/quiz' },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Игры</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game, i) => (
          <div key={i} className="card flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <p className="text-muted mb-4">{game.desc}</p>
            <Link to={game.to} className="btn btn-primary w-full text-center">Играть</Link>
          </div>
        ))}
      </div>
    </div>
  );
}