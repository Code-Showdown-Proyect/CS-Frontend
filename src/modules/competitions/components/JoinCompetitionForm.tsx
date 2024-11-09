import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompetitionService } from "../services/CompetitionService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";
import {FaSpinner} from "react-icons/fa";
import {useTranslation} from "react-i18next";

const JoinCompetitionForm: React.FC = () => {
    const [accessCode, setAccessCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const[t] = useTranslation("global");
    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            await CompetitionService.joinCompetition(accessCode, password);
            setIsLoading(false);
            navigate('/CompetitionLobby', {state: {accessCode, password}});
        } catch (error) {
            setIsLoading(false);
            console.error('Error joining the competition:', error);
            alert(t("join-competition.error"));
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900" />
                        <p className="text-lg font-semibold">{t("join-competition.loading")}</p>
                    </div>
                </div>
            )}
            <form className="space-y-6" onSubmit={handleJoin}>
                <div className="mt-2">
                    <Label>{t("join-competition.access-code")}</Label>
                    <Input
                        placeholder="ASXSD"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-2">
                    <Label>{t("join-competition.password")}</Label>
                    <Input
                        placeholder="********"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button variant="secondary" type="submit">{t("join-competition.join")}</Button>
                <Button variant="secondary" type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>
                    <div className="flex items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"/>
                        <span>{t("join-competition.back")}</span>
                    </div>
                </Button>
            </form>
        </div>
    );
};
export default JoinCompetitionForm;