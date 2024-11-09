import {useState} from "react";
import {Label} from "../../../shared/components/UI/Label.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import {useTranslation} from "react-i18next";

interface GenerateChallengeForm{
    onSubmit:(difficulty: string, topic: string) => void;
    onCancel: () => void;
}

const GenerateChallengeForm: React.FC<GenerateChallengeForm> = ({onSubmit, onCancel}) => {
    const [difficulty, setDifficulty] = useState<string>('easy');
    const [topic, setTopic] = useState<string>('');
    const [t] = useTranslation("global");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(difficulty, topic);
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full ">
            <h3 className="mt-1 mb-1 text-left text-2xl/9 font-medium tracking-tight text-gray-900">{t("generate-challenges.title")}</h3>
            <form className="space-y-6"  onSubmit={handleSubmit}>
                <Label>
                    {t("generate-challenges.difficulty")}:
                    <select className="ml-2 h-full rounded-md border-2 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">{t("generate-challenges.easy")}</option>
                        <option value="normal">{t("generate-challenges.medium")}</option>
                        <option value="hard">{t("generate-challenges.hard")}</option>
                    </select>
                </Label>
                <Label>
                    {t("generate-challenges.topic")}:
                    <Input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={t("generate-challenges.topic-placeholder")}
                    />
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