import React, { useCallback, useEffect, useState } from "react"
import { useHistory } from "react-router"
import AuthContext from "./AuthContext"
import Login from "../../api/Login"

const AuthProvider = (props) => {
    const history = useHistory()
    const [user, setUser] = useState(null);
    const isLogged = useCallback(() => {
        return getAccessToken() !== null && getRefreshToken() !== null
    }, [])
    const loginApi = new Login();

    const login = async (username, password) => {
        const response = {
            ok: false,
            data: {},
            code: 401
        }
        try {
            const tokens = await loginApi.login(username, password)
            response.ok = true;
            response.code = 200;
            response.data = tokens;
        } catch (err) {
            console.log(err)
            response.data = err;
        }

        return response;
    }

    const logout = () => {
        return loginApi.logout().then(() => {
            clearTokens()
            return true
        })
    }

    const refreshTokens = () => {
        return loginApi.refreshToken()
    }

    const setTokens = ({accessToken, refreshToken}) => {
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
    }

    const clearTokens = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }

    const getPayload = () => {
        let retorno = false;
        const accessToken = getAccessToken();
        if (accessToken) {
            return JSON.parse(atob(accessToken.split('.')[1]));
        }
        return retorno;
    }

    const getUser = () => user

    const getAccessToken = () => {
        return localStorage.getItem("accessToken") || null;
    }

    const getRefreshToken = () => {
        return localStorage.getItem("refreshToken") || null;
    }

    const setAccessToken = (accessToken) => {
        localStorage.setItem('accessToken', accessToken)
    }

    const setRefreshToken = (refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken)
    }

    useEffect(() => {
        if (!isLogged()) {
            setUser(null)
            history.push('/login')
        }
    }, [isLogged, setUser, history])

    return (
        <AuthContext.Provider 
            value={{
                login,
                logout,
                getPayload,
                setUser,
                getUser,
                getAccessToken,
                getRefreshToken,
                setAccessToken,
                setRefreshToken,
                setTokens,
                clearTokens,
                refreshTokens
            }} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;