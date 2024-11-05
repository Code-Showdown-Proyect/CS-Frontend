import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompetitionService } from "../services/CompetitionService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";

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
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleJoin}>
                <div className="mt-2">
                    <Label>Access Code</Label>
                    <Input
                        placeholder="ASXSD"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-2">
                    <Label>Password</Label>
                    <Input
                        placeholder="********"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button variant="secondary" type="submit">Join Competition</Button>
                <Button variant="secondary" type={"button"} onClick={() => navigate('/OnlineCompetitionMenu')}>
                    <div className="flex items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"/>
                        <span>Back</span>
                    </div>
                </Button>
            </form>
        </div>
    );
};

export default JoinCompetitionForm;
