import React from "react";
import {Header} from "../layout/Header";
import {Content} from "../layout/Content";
import '../../styles/index.scss'

export const ProfilePage = ({isUserLogged, setIsUserLogged}) => {
    return (
        <div className="App">
            <Header isUserLogged={isUserLogged} setIsUserLogged={setIsUserLogged}/>
            <div className="content">
                <Content/>
            </div>
        </div>
    )
};
