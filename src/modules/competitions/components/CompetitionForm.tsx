import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {CompetitionService} from "../services/CompetitionService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";

const CompetitionForm: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [timeLimit, setTimeLimit] = useState<number>(5);
    const [numberOfExercises, setNumberOfExercises] = useState<number>(1);
    const navigate = useNavigate();
    const location = useLocation();
    const {mode} = location.state || {};
    const isSinglePlayer = mode === 'sp';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const competitionData = {
            name,
            number_of_exercises: Number(numberOfExercises),
            time_limit: Number(timeLimit),
            password: isSinglePlayer ? '' : password,
        };

        try {
            const access_code = await CompetitionService.createCompetition(competitionData);
            await CompetitionService.joinCompetition(access_code, password);
            alert('Competition created successfully.');
            navigate('/CompetitionLobby', {state: {accessCode:access_code, password, mode}}); // Redirige a la lista de competencias.
        } catch (error) {
            console.error('Error creating the competition:', error);
            alert('There was an error creating the competition.');
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form  className="space-y-6" onSubmit={handleSubmit}>
                <div className="mt-2">
                    <Label>Competition Name</Label>
                    <Input
                        placeholder="example"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label>Numbers of Exercises (1-4)</Label>
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
                    <Label>Time Limit (minutes 5-30)</Label>
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
                        <Label>Password (if you can't set a password leave in blank)</Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}
                <Button type="submit">Create Competition</Button>
                {!isSinglePlayer && (
                    <Button type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>Back</Button>
                )}
                {isSinglePlayer && (
                    <Button type={"button"} onClick={() => navigate('/Menu')}>Back</Button>
                )}
            </form>
        </div>
    );
};

export default CompetitionForm;