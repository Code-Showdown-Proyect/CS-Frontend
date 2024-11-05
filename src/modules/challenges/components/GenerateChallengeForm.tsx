import {useState} from "react";
import {Label} from "../../../shared/components/UI/Label.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";

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
        <div className="mt-10 sm:mx-auto sm:w-full ">
            <h3 className="mt-1 mb-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">Generate Challenge</h3>
            <form className="space-y-6"  onSubmit={handleSubmit}>
                <Label>
                    Difficulty:
                    <select className="ml-2 h-full rounded-md border-2 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                </Label>
                <Label>
                    Topic:
                    <Input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Write the Topic..."
                    />
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 md:pr-10 md:pl-10 gap-4 mb-10">
                    <Button variant="primary" type="submit">Generate</Button>
                    <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </div>
    );
}
export default GenerateChallengeForm;