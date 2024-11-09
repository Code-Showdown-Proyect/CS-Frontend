import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../../auth/hooks/useAuth.ts";
import logo from "../../../assets/logo.png";
import {useTranslation} from "react-i18next";
import peFlag from "../../../assets/flags/pe.svg";
import usFlag from "../../../assets/flags/us.svg";


function classNames(...classes: string[]):string {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [t, i18n] = useTranslation("global");
    const navigation = [
        { name: t("navbar.home"), href: '/menu', current: true },
        { name: t("navbar.single-player"), href: '/CreateCompetition', current: false },
        { name: t("navbar.multi-player"), href: '/OnlineCompetitionMenu', current: false },
    ];
    const navigationPreAuth = [
        { name: t("navbar.login"), href: '/auth/login', current: true },
        { name: t('navbar.register'), href: '/auth/register', current: false },
    ]
    const handleNavigation = (item: {name: string , href: string, current: boolean}) => {
        if (item.name === 'Single Player') {
            navigate(item.href, { state: { mode: "sp" } });
        } else {
            navigate(item.href);
        }
    }
    const handleLogout = () => {
        logout();
        navigate('/auth/login'); // Redirigir al usuario al login después de cerrar sesión.
        //console.log("Logout successful:", localStorage.getItem('token'));
    };

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language); // Almacenar el idioma seleccionado
    }


    return (
        <Disclosure as="nav" className="bg-[#0a0020]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton
                            className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5"/>
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden"/>
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block"/>
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="mx-auto h-11 w-auto rounded-full" src={logo}
                                 alt="Code Showdown"/>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            {document.title !== "Login Page" && document.title !== "Register Page" && (
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item)}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {(document.title === "Login Page" || document.title === "Register Page") && (
                                <div className="flex space-x-4">
                                    {navigationPreAuth.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item)}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Botones de cambio de idioma */}
                    <div className="flex items-center space-x-4">
                        {/* Botones de cambio de idioma */}
                        <div className="flex items-center space-x-2">
                            <button
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white transition ease-in-out duration-300"
                                onClick={() => changeLanguage("es")}>
                                <img src={peFlag} alt="Español" className="h-5 w-5 inline-block mr-1"/>
                                ES
                            </button>
                            <button
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white transition ease-in-out duration-300"
                                onClick={() => changeLanguage("en")}>
                                <img src={usFlag} alt="English" className="h-5 w-5 inline-block mr-1"/>
                                EN
                            </button>
                        </div>

                        {document.title !== "Login Page" && document.title !== "Register Page" && (
                            <div
                                className="flex items-center space-x-4">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <div>
                                        <MenuButton
                                            className="flex rounded-full bg-[#0a0020] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <UserIcon
                                                className="h-8 w-8 text-gray-400 hover:text-white transition-all duration-300 ease-in-out"/>
                                        </MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        <MenuItem>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                                                type={"button"}
                                                onClick={() => navigate('/Profile')}>{t("navbar.profile")}
                                            </button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                                                onClick={handleLogout}>{t("navbar.logout")}
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                {document.title !== "Login Page" && document.title !== "Register Page" && (
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                )}
                {(document.title === "Login Page" || document.title === "Register Page") && (
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navigationPreAuth.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                )}
            </DisclosurePanel>
        </Disclosure>
    );
}
