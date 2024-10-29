import {useState} from "react";

interface GenerateChallengeForm{
    onSubmit:(difficulty: string, topic: string) => void;
    onCancel: () => void;
}

const GenerateChallengeForm: React.FC<GenerateChallengeForm> = ({onSubmit, onCancel}) => {
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [topic, setTopic] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(difficulty, topic);
    };

    return (
        <div className="modal">
            <h3>Generate Challenge</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Difficulty:
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <label>
                    Topic:
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Write the Topic..."
                    />
                </label>
                <button type="submit">Generate</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}
export default GenerateChallengeForm;