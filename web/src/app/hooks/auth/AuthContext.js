import React from "react";

const AuthContext = React.createContext({
    token: null,
    user: null
})

export default AuthContext;