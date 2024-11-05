import RegisterForm from "../components/RegisterForm.tsx";

const RegisterPage = () => {
    return(
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Register Page</h1>
                <RegisterForm/>
            </div>
        </div>
    );
};

export default RegisterPage;
