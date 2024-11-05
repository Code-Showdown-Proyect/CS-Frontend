import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompetitionService } from "../services/CompetitionService.ts";
import {Label} from "../../../shared/components/UI/Label.tsx";
import {Input} from "../../../shared/components/UI/Input.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";
import {FaSpinner} from "react-icons/fa";

const JoinCompetitionForm: React.FC = () => {
    const [accessCode, setAccessCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
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
            alert('There was an error joining the competition.');
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md justify-items-center">
                        <FaSpinner className="animate-spin h-10 w-10 text-blue-900" />
                        <p className="text-lg font-semibold">Joining to Competition...</p>
                        <p>Please wait while we prepare the competition. This might take a few seconds.</p>
                    </div>
                </div>
            )}
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