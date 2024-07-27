import React, { useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/reset.css";
import AuthContextProvider from "../src/contexts/AuthContext";
import ThemeContextProvider from "../src/contexts/ThemeContext";
import RoomContextProvider from "../src/contexts/RoomContext";
import UserContextProvider from "../src/contexts/UserContext";
import AdminUserContextProvider from "../src/contexts/admin/AdminUserContext";
import SettingsContextProvider from "../src/contexts/admin/SettingsContext";
import AdminConversationContextProvider from "../src/contexts/admin/AdminConversation";
import ConversationContextProvider from "../src/contexts/ConversationContext";
import { SocketProvider } from "@/contexts/SocketContext";

function App({ Component, pageProps }: AppProps) {
    const CustomLayout = Component.Layout || EmptyLayout;

    return (
        <>
            <ThemeContextProvider>
                <AuthContextProvider>
                    <SocketProvider>
                        <AdminUserContextProvider>
                            <AdminConversationContextProvider>
                                <SettingsContextProvider>
                                    <UserContextProvider>
                                        <RoomContextProvider>
                                            <ConversationContextProvider>
                                                <CustomLayout>
                                                    <Component {...pageProps} />
                                                </CustomLayout>
                                            </ConversationContextProvider>
                                        </RoomContextProvider>
                                    </UserContextProvider>
                                </SettingsContextProvider>
                            </AdminConversationContextProvider>
                        </AdminUserContextProvider>
                    </SocketProvider>
                </AuthContextProvider>
            </ThemeContextProvider>
        </>
    );
}
const EmptyLayout = ({ children }: any) => <>{children}</>;

export default App;
