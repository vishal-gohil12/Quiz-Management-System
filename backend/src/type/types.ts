export type Quiz = {
    title: string;
    description: string;
    username: string;
    questions: Question[];
}

export type Question = {
    questionText: string;
    options: Option[];
}

export type Option = {
    text: string;
    isCorrect: boolean;
}

export type User = {
    username: string;
    password: string;
}