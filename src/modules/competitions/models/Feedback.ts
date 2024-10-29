export interface Feedback {
    challenge_title: string;
    feedback: string;
    score: number;
}

export interface FeedbackMessage {
    participant_id: number;
    feedbacks: Feedback[];
}
