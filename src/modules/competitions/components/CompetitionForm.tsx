import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {CompetitionService} from "../services/CompetitionService.ts";

const CompetitionForm: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [timeLimit, setTimeLimit] = useState<number>(0);
    const [numberOfExercises, setNumberOfExercises] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();
    const {mode} = location.state || {};
    const isSinglePlayer = mode === 'sp';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const competitionData = {
            name,
            number_of_exercises:numberOfExercises,
            time_limit: timeLimit,
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Competition Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Numbers of Exercises</label>
                <input
                    type="number"
                    value={numberOfExercises}
                    onChange={(e) => setNumberOfExercises(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Time Limit (minutes)</label>
                <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    required
                />
            </div>
            {!isSinglePlayer && (
                <div>
                    <label>Password (if you can't set a password leave in blank)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            )}
            <button type="submit">Create Competition</button>
            {!isSinglePlayer && (
                <button type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>Back</button>
            )}
            {isSinglePlayer && (
                <button type={"button"} onClick={() => navigate('/Menu')}>Back</button>
            )}
        </form>
    );
};

export default CompetitionForm;