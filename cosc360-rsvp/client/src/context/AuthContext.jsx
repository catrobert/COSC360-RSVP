import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function normalizeActiveUser(rawUser) {
    if (!rawUser) {
        return null;
    }

    const activeUserId = rawUser.id || rawUser._id;
    if (!activeUserId) {
        return null;
    }

    return {
        ...rawUser,
        id: activeUserId.toString(),
    };
}

export function AuthProvider({ children }) {
    const [activeUser, setActiveUser] = useState(() => {
        const saved = localStorage.getItem('user');
        if (!saved) {
            return null;
        }

        try {
            return normalizeActiveUser(JSON.parse(saved));
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });

    const login = (userData) => {
        const normalizedUser = normalizeActiveUser(userData);
        setActiveUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setActiveUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
    };

    const value = useMemo(() => {
        return {
            user: activeUser,
            activeUser,
            activeUserId: activeUser?.id || null,
            login,
            logout,
        };
    }, [activeUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);