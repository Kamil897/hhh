import { GamesService } from './games.service';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    getQuiz(): {
        id: string;
        question: string;
        answers: string[];
    };
    answer(req: any, body: {
        id: string;
        answer: number;
    }): Promise<{
        correct: boolean;
        reward?: undefined;
    } | {
        correct: boolean;
        reward: number;
    }>;
}
