import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GamesService } from './games.service';

const QUESTIONS = [
  { id: 'q1', question: '2 + 2 = ?', answers: ['3', '4', '5'], correct: 1, reward: 2 },
  { id: 'q2', question: 'Столица Франции?', answers: ['Берлин', 'Париж', 'Рим'], correct: 1, reward: 2 },
];

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('quiz')
  getQuiz() {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    return { id: q.id, question: q.question, answers: q.answers };
  }

  @Post('quiz/answer')
  async answer(@Req() req: any, @Body() body: { id: string; answer: number }) {
    const q = QUESTIONS.find((x) => x.id === body.id);
    if (!q) return { correct: false };
    const correct = q.correct === body.answer;
    if (correct) {
      await this.gamesService.awardPoints(req.user.sub, q.reward, 'game_quiz', `Quiz ${q.id}`);
    }
    return { correct, reward: correct ? q.reward : 0 };
  }
}