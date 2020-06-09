import React from 'react';
import {Header} from "./components/layout/Header";
//import './App.css';
import {Content} from "./components/layout/Content";
import './styles/index.scss'

export const App = () => {
    return (
        <div className="App">
            <Header/>
            <div className="content">
                <Content/>
            </div>
        </div>
    );
};
