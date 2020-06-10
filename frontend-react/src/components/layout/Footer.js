import React from "react";
import {DeleteAlert} from "./DeleteAlert";

export const Footer = (alertType) => {
    console.log('moje dane to: ', alertType);
    if (alertType && alertType.length !== 0) {
        return (
            <div>
                <div className='footer'>
                    <DeleteAlert/>
                </div>
            </div>
        )
    }
    return null;
};
