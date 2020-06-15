import React from "react";
import {DeleteAlert} from "./DeleteAlert";
import {strings} from "../../localization";
import {useToasts} from "react-toast-notifications";
import {PolishFlag} from "../logos/PolishFlag";
import {EnglishFlag} from "../logos/EnglishFlag";
import Button from "@material-ui/core/Button";
import Cookies from 'universal-cookie';

export const Footer = () => {
    const cookie = new Cookies();
    const current = new Date();
    const nextYear = new Date();

    nextYear.setFullYear(current.getFullYear() + 1);

    console.log('language is: ', strings.getLanguage());
    return (
        <div>
            <div className='footer'>
                <Button onClick={() => {cookie.set('page_lang','pl', {path: '/', expires: nextYear}); window.location.reload(false);}}> <PolishFlag/> </Button>
                <Button onClick={() => {cookie.set('page_lang','eng', {path: '/', expires: nextYear}); window.location.reload(false);}}> <EnglishFlag/> </Button>
            </div>
        </div>
    )
};
