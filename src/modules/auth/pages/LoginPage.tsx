import LoginForm from "../components/LoginForm.tsx";

const LoginPage=() =>{
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-32 w-auto rounded-full" src="/src/assets/logo.png" alt="Code Showdown"/>
                <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login</h1>
                <LoginForm/>
            </div>
        </div>
    );
};
export default LoginPage;