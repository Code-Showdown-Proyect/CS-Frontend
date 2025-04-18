import {useState} from "react";
import {Label} from "../../../shared/components/UI/Label.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {useTranslation} from "react-i18next";
import {ChallengeService} from "../services/ChallengeService.ts";
import {Topic} from "../models/Topic.ts";
interface GenerateChallengeForm{
    onSubmit:(difficulty: string, topic: string, numberOfClues: number) => void;
    onCancel: () => void;
}

const GenerateChallengeForm: React.FC<GenerateChallengeForm> = ({onSubmit, onCancel}) => {
    const [difficulty, setDifficulty] = useState<string>('');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topic, setTopic] = useState<string>('');
    const[numberOfClues, setNumberOfClues] = useState<number>(0);
    const [t] = useTranslation("global");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!difficulty) {
            alert(t("generate-challenges.error-difficulty")); // mensaje traducido
            return;
        }

        if (!topic.trim()) {
            alert(t("generate-challenges.error-topic")); // mensaje traducido
            return;
        }

        onSubmit(difficulty, topic, numberOfClues);
    };

    const handleDifficultyChange = async  (value: string) => {
        setDifficulty(value);

        // Asignar cantidad de pistas según la dificultad
        switch (value) {
            case 'easy':
                setNumberOfClues(5);
                break;
            case 'medium': // asumiendo que "normal" es medium
                setNumberOfClues(3);
                break;
            case 'hard':
                setNumberOfClues(1);
                break;
            default:
                setNumberOfClues(0);
        }
        try {
            const fetchedTopics = await ChallengeService.getTopicsByDifficulty(value);
            setTopics(fetchedTopics);
            setTopic(''); // Resetear el tópico seleccionado
        } catch (error) {
            console.error(error);
            setTopics([]);
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full ">
            <h3 className="mt-1 mb-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("generate-challenges.title")}</h3>
            <form className="space-y-6"  onSubmit={handleSubmit}>
                <Label>
                    {t("generate-challenges.difficulty")}:
                    <select className="ml-2 h-full rounded-md border-2 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={difficulty} onChange={(e) => handleDifficultyChange(e.target.value)}>
                        <option value="" disabled>
                            {t("generate-challenges.select-difficulty")}
                        </option>
                        <option value="easy">{t("generate-challenges.easy")}</option>
                        <option value="medium">{t("generate-challenges.medium")}</option>
                        <option value="hard">{t("generate-challenges.hard")}</option>
                    </select>
                </Label>
                <Label>
                    {t("generate-challenges.topic")}:
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="ml-2 h-full rounded-md border-2 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                        <option value="">{t("generate-challenges.select-topic")}</option>
                        {topics.map((t) => (
                            <option key={t.id} value={t.description}>
                                {t.description}
                            </option>
                        ))}
                    </select>
                </Label>

                <Label>
                    {t("generate-challenges.number-of-clues")}: {numberOfClues}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 md:pr-10 md:pl-10 gap-4 mb-10">
                    <Button variant="primary" type="submit">{t("generate-challenges.generate")}</Button>
                    <Button variant="secondary" type="button" onClick={onCancel}>{t("generate-challenges.back")}</Button>
                </div>
            </form>
        </div>
    );
}
export default GenerateChallengeForm;