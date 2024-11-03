import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Challenge} from "../models/Challenge.ts";
import { FeedbackMessage} from "../models/Feedback.ts";
import {AuthService} from "../../auth/services/AuthService.ts";
import {CompetitionService} from "../services/CompetitionService.ts";

const OnlineCompetitionPage:React.FC=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCode, password, competitionId, mode} = location.state;
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState<string>("");
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [currentParticipantId, setCurrentParticipantId] = useState<number | null>(null);
    const [waitingForOthers, setWaitingForOthers] = useState<boolean>(false);
    const [competitionFinished, setCompetitionFinished] = useState<boolean>(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const isSinglePlayer = mode === 'sp';
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                const participantId = await CompetitionService.getParticipantByUserIdAndCompetitionId(competitionId, currentUser.user_id);
                setCurrentParticipantId(participantId.participant_id);
                console.log("Current user", currentUser.user_id);
            } catch (error) {
                console.error("Error fetching current user ID:", error);
            }
        };
        fetchUserId();
    }, []);


    useEffect(() => {
        if (currentParticipantId === null) {
            return;
        }
        const wsUrl = `wss://cs-competition-context.mangograss-fe7e2f05.brazilsouth.azurecontainerapps.io/ws/competition/${competitionId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to websocket");
            ws.send('send_challenges');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_message') {
                setMessages((prevMessages) => [...prevMessages, `${data.user}: ${data.message}`]);
            } else if (data.type === 'new_challenge') {
                setChallenge(data);
                setWaitingForOthers(false); // Permitir enviar la respuesta ya que hay un nuevo desafío.
            }  else if (data.message === 'Waiting_others') {
                setWaitingForOthers(true); // Deshabilitar el envío de respuestas mientras se espera a los demás.
            } else if (data.action === 'all_participants_done') {
                console.log('all_participants_done');
                setCompetitionFinished(true);
                setWaitingForOthers(false);
            }else if (data.type === 'feedbacks') {
                setCompetitionFinished(true);
                console.log('Receiving feedbacks:', data);
                setFeedbacks(data.data); // `data.data` es un array de `FeedbackMessage`
            }
        }

        ws.onclose = () => {
            console.log("Disconnected from websocket");
        }

        ws.onerror = (error) => {
            console.error("Error on websocket connection",error);
        }

        setWebsocket(ws);

        const handleBeforeUnload = async () => {
            if (!isNavigating) {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
                await CompetitionService.leaveCompetition(accessCode);
                console.log('Conexión WebSocket cerrada y abandonando la competencia antes de cerrar la pestaña');
            }
        };
        const handleNavigation = () => {
            setIsNavigating(true);
        };
        window.addEventListener('popstate', handleNavigation);
        // Añadir el evento `beforeunload` para cerrar la conexión al cerrar la pestaña o navegar
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Remover el evento `beforeunload` y cerrar el WebSocket al desmontar el componente
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener('popstate', handleNavigation);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log("WebSocket closed on component unmount");
            }
        };

    }, [competitionId, currentParticipantId]);


    const handleSendMessage = (message: string) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(`chat_message ${message}`);
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    };

    const handleSubmitCode = () => {
        if(websocket&&challenge&&!waitingForOthers && !competitionFinished){
            websocket.send(`submit_answer ${code}`);
            setCode("");
            setWaitingForOthers(true);
        }
    }
    const handleRequestFeedbacks = () => {
        if (websocket && !competitionFinished) {
            websocket.send('feedback_response');
            console.log('Requesting feedbacks...');
        }
    };
    if (competitionFinished) {
        const participantFeedbacks = feedbacks.find(fb => fb.participant_id === currentParticipantId);
        console.log('participantFeedbacks:', participantFeedbacks);
        if (!participantFeedbacks || participantFeedbacks.feedbacks.length === 0) {
            return (
                <div>
                    <h1>COMPETITION COMPLETED, GENERATING FEEDBACKS, PLEASE WAIT...</h1>
                </div>
            );
        }

        return (
            <div>
                <h1>Feedback Summary</h1>
                {participantFeedbacks.feedbacks.map((feedback, index) => (
                    <div key={index}>
                        <h3>{feedback.challenge_title}</h3>
                        <p><strong>Feedback:</strong> {feedback.feedback}</p>
                        <p><strong>Score:</strong> {feedback.score}</p>
                    </div>
                ))}
                <button onClick={() => navigate('/CompetitionLobby', { state: {accessCode, password, competitionId, mode }})}>Back to Lobby</button>
            </div>
        );
    }
    return (
        <div>
            <h1>Competition in Progress</h1>
            {!isSinglePlayer && (
                <div className="chat-section">
                    <h2>Participants Chat</h2>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Write a Message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                                handleSendMessage(e.currentTarget.value);
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                </div>
            )}
            <div className="challenge-section">
                <h2>Current Challenge</h2>
                {waitingForOthers ? (
                    <div>
                        <p>WAIT FOR OTHERS TO FINISH THE CHALLENGE</p>
                    </div>
                ) : challenge ? (
                    <div>
                        <h3>{challenge.title}</h3>
                        <p>{challenge.description}</p>
                        <pre>{challenge.output_example}</pre>
                    </div>
                ) : (
                    <p>No challenge yet</p>
                )}
            </div>

            <div className="code-section">
                <h2>Send your Solution</h2>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={10}
                    cols={50}
                    placeholder="Write your code here..."
                    disabled={waitingForOthers} // Desactivar textarea cuando se está esperando
                />
                <button
                    onClick={handleSubmitCode}
                    disabled={!challenge || code.trim() === '' || waitingForOthers} // Desactivar botón cuando se está esperando o no hay desafío
                >
                    Submit
                </button>
                <button onClick={handleRequestFeedbacks}>
                    Request Feedbacks
                </button>
            </div>
            {waitingForOthers && (
                <p>Waiting for other participants to finish...</p>
            )}
        </div>
    );
};
export default OnlineCompetitionPage;
