import React from "react";
import {Header} from "../layout/Header";
import {Content} from "../layout/Content";
import '../../styles/index.scss'

export const ProfilePage = () => {
    return (
        <div className="App">
            <Header/>
            <div className="content">
                <Content/>
            </div>
        </div>
    )
};
