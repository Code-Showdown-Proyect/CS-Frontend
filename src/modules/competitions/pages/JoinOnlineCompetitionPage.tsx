import JoinCompetitionForm from "../components/JoinCompetitionForm.tsx";
import Navbar from "../../public/components/Navbar.tsx";

const JoinOnlineCompetitionPage: React.FC = () => {
    document.title = "Join Competition";
    return(
        <div>
            <Navbar/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Join Competition</h1>
                    <JoinCompetitionForm/>
                </div>
            </div>
        </div>
    )
}
export default JoinOnlineCompetitionPage;