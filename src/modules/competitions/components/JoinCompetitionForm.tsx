import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompetitionService } from "../services/CompetitionService.ts";

const JoinCompetitionForm: React.FC = () => {
    const [accessCode, setAccessCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await CompetitionService.joinCompetition(accessCode, password);
            alert('Successfully joined the competition.');
            navigate('/CompetitionLobby', {state: {accessCode, password}});
        } catch (error) {
            console.error('Error joining the competition:', error);
            alert('There was an error joining the competition.');
        }
    };

    return (
        <form onSubmit={handleJoin}>
            <div>
                <label>Access Code</label>
                <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Join Competition</button>
            <button type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>Back</button>
        </form>
    );
};

export default JoinCompetitionForm;
