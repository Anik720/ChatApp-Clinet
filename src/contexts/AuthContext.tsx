import Router from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { API } from "../utils/api";
import Fetch from "../utils/axios";
import NotoficationHandler from "../utils/notificationHandler";

export const AuthContext = createContext({
    isAuthLoading: false,
    login: (data: object) => {},
    register: (data: object, form = null, setVisibleForm: any) => {},
    checkAuth: () => {},
    setIsAuthLoading: (data: boolean) => {},
    user: null,
    setUser: (data: object) => {},
    logout: () => {},
    forgotPassword: (data: object) => {},
    resetPassword: (data: object) => {},
    guestRegister: (data: object) => {},
    isAuthModalOpen: false,
    setIsAuthModalOpen: (data: boolean) => {},
    visibleForm: "guest",
    setVisibleForm: (data: string) => {}
});

export default function AuthContextProvider({ children }: any) {
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [visibleForm, setVisibleForm] = useState<string>("guest");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

    const login = async (data: object) => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(API.auth.LOGIN, data);
            NotoficationHandler(result.data, "success");
            setIsAuthLoading(false);
            const { user } = result.data;
            if (user.type === "admin") {
                Router.push("/admin/dashboard");
            } else {
                setIsAuthModalOpen(false);
                window.location.reload();
            }
        } catch (error: any) {
            NotoficationHandler(error?.response?.data, "error");
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    const register = async (data: object, form = null, setVisibleForm: any) => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(API.auth.REGISTER, data);
            form && form.resetFields();
            setVisibleForm("login");
            NotoficationHandler(result.data, "success");
            setIsAuthLoading(false);
            setVisibleForm("login");
        } catch (error: any) {
            NotoficationHandler(error.response.data, "error");
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    const checkAuth = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Fetch.get("/auth/me");
                setUser(result.data.user);
                localStorage.setItem("loggedInUser", JSON.stringify(result.data.user))
                resolve(result);
            } catch (error: any) {
                console.log(error);
                reject(error);
            }
        });
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(API.auth.LOGOUT);
            NotoficationHandler(result.data, "success");
            setIsAuthLoading(false);
            localStorage.setItem("rooms", JSON.stringify([]))
            localStorage.setItem("loggedInUser", null)
            localStorage.setItem("CurrentRoom", null)
            Router.push("/chat");
            window.location.reload();
        } catch (error: any) {
            NotoficationHandler(error?.response?.data?.message || "Something went wrong", error);
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    const forgotPassword = async (data: object) => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(API.auth.FORGOT_PASSWORD, data);
            NotoficationHandler(result.data, "success");
            setIsAuthLoading(false);
            // Router.push("/login");
        } catch (error: any) {
            NotoficationHandler(error.response.data, "error");
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    const resetPassword = async (data: any) => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(`${API.auth.RESET_PASSWORD}/${data.token}`, data);
            NotoficationHandler(result.data, "success");
            setIsAuthLoading(false);
            Router.push("/login");
        } catch (error: any) {
            NotoficationHandler(error?.response?.data, "error");
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    const guestRegister = async (data: object) => {
        setIsAuthLoading(true);
        try {
            const result = await Fetch.post(API.auth.GUEST_REGISTER, data);
            NotoficationHandler(result.data, "success");
            localStorage.setItem("authToken", result.data.token);
            location.reload();
            setIsAuthLoading(false);
        } catch (error: any) {
            NotoficationHandler(error.response.data, "error");
            setIsAuthLoading(false);
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthLoading,
                login,
                register,
                checkAuth,
                setIsAuthLoading,
                user,
                setUser,
                logout,
                forgotPassword,
                resetPassword,
                guestRegister,
                isAuthModalOpen,
                setIsAuthModalOpen,
                setVisibleForm,
                visibleForm
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => React.useContext(AuthContext);
