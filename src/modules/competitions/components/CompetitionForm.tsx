import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {CompetitionService} from "../services/CompetitionService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {FaSpinner} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";

const CompetitionForm: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [timeLimit, setTimeLimit] = useState<number>(5);
    const [numberOfExercises, setNumberOfExercises] = useState<number>(1);
    const navigate = useNavigate();
    const location = useLocation();
    const {mode} = location.state || {};
    const isSinglePlayer = mode === 'sp';
    const [isLoading, setIsLoading] = useState(false);
    const [t] = useTranslation("global");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const competitionData = {
            name,
            number_of_exercises: Number(numberOfExercises),
            time_limit: Number(timeLimit),
            password: isSinglePlayer ? '' : password,
        };
        try {
            setIsLoading(true);
            const access_code = await CompetitionService.createCompetition(competitionData);
            await CompetitionService.joinCompetition(access_code, password);
            alert(t("create-competition.success"));
            setIsLoading(false);
            navigate('/CompetitionLobby', {state: {accessCode:access_code, password, mode}}); // Redirige a la lista de competencias.
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating the competition:', error);
            alert(t("create-competition.error"));
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900"/>
                        <p className="text-lg font-semibold">{t("create-competition.loading")}</p>
                    </div>
                </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="mt-2">
                <Label>{t("create-competition.name")}</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label>{t("create-competition.number-of-exercises")}</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={numberOfExercises}
                        onChange={(e) =>
                            {
                                const value = Number(e.target.value);
                                if (value > 0 && value <= 4){
                                    setNumberOfExercises(value)
                                }
                            }
                        }
                        required
                    />
                </div>
                <div>
                    <Label>{t("create-competition.time-limit")}</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={timeLimit}
                        onChange={(e) =>
                            {
                                const value = Number(e.target.value);
                                if (value > 4 && value <= 30){
                                    setTimeLimit(value)
                                }
                            }
                        }
                        required
                    />
                </div>
                {!isSinglePlayer && (
                    <div>
                        <Label>{t("create-competition.password")}</Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}
                <Button type="submit">{t("create-competition.create")}</Button>
                {!isSinglePlayer && (
                    <Button variant="secondary" type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>
                        <div className="flex items-center space-x-2">
                            <ArrowLeftIcon className="h-5 w-5"/>
                            <span>{t("create-competition.back")}</span>
                        </div>
                    </Button>

                )}
                {isSinglePlayer && (
                    <Button variant="secondary" type={"button"}
                            onClick={() => navigate('/Menu')}> <div className="flex items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"/>
                        <span>{t("create-competition.back")}</span>
                    </div></Button>
                )}
            </form>
        </div>
    );
};

export default CompetitionForm;