import {useNavigate} from 'react-router-dom';
const OnlineCompetitionMenuPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Online Competition Menu</h1>
            <p>Welcome to the menu Competition.</p>
            <button type={"button"} onClick={() => navigate('/CreateCompetition')}>Create Room</button>
            <button type={"button"} onClick={() => navigate('/JoinCompetition')}>Join a Room</button>
            <button type={"button"} onClick={() => navigate('/Menu')}>Back</button>
        </div>
    );
};
export default OnlineCompetitionMenuPage;