export default function QuizGame() {
  const question = {
    text: 'Столица Узбекистана?',
    answers: ['Бишкек', 'Ташкент', 'Алматы', 'Душанбе'],
  };

  return (
    <div className="container py-10 flex flex-col items-center">
      <div className="card w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">{question.text}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.answers.map((a, i) => (
            <button key={i} className="btn btn-secondary w-full">
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}