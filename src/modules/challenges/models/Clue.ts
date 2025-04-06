export interface CluesRequest {
    challenge_id: number;
    challenge_text: string;
    number_of_clues: string;
}
export interface Clue {
    id: number;
    challenge_id: number;
    description: string;
    order_num: number;
    created_at?: string; // Si es opcional o viene del backend
}
