import {useNavigate} from 'react-router-dom';
import Navbar from "../../public/components/Navbar.tsx";
import Button from "../../../shared/components/UI/Button.tsx";
import {ArrowLeftIcon} from "@heroicons/react/16/solid";
import {useTranslation} from "react-i18next";
const OnlineCompetitionMenuPage = () => {
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    document.title = "Online Competition Menu";
    return (
        <div>
            <Navbar/>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">{t("online-competition-menu.title")}</h1>
                    <p className="mt-1 text-center text-2xl/9 font-light tracking-tight text-gray-900">{t("online-competition-menu.subtitle")}</p>
                    <div className="mt-2">
                        <Button variant="secondary" type={"button"} onClick={() => navigate('/CreateCompetition')}>{t("online-competition-menu.create-room")}</Button>
                    </div >
                    <div className="mt-2">
                        <Button variant="secondary" type={"button"} onClick={() => navigate('/JoinCompetition')}>{t("online-competition-menu.join-room")}</Button>
                    </div>
                    <div className="mt-2">
                        <Button variant="secondary" type={"button"} onClick={() => navigate('/Menu')}>
                            <div className="flex items-center space-x-2">
                                <ArrowLeftIcon className="h-5 w-5"/>
                                <span>{t("online-competition-menu.back")}</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OnlineCompetitionMenuPage;