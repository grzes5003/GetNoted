import React from "react";

// icon used for signalizing if particular task is completed
export const StatusIcon = ({active}) => {
    const orange = "#FC7A1E";
    const grey = "#a4a4a4";

    if(active) {
        return (
            <svg width="25" height="67" viewBox="0 0 25 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d)">
                    <rect width="52.4464" height="9.38667" rx="4.69333" transform="matrix(0 -1 -1 0 17.08 59.5179)"
                          fill={orange}/>
                </g>
                <defs>
                    <filter id="filter0_d" x="0.693329" y="0.0714111" width="23.3867" height="66.4464"
                            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix"
                                       values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="3.5"/>
                        <feColorMatrix type="matrix"
                                       values="0 0 0 0 0.988235 0 0 0 0 0.478431 0 0 0 0 0.117647 0 0 0 0.6 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    </filter>
                </defs>
            </svg>
        );
    }
    return (
        <svg width="25" height="67" viewBox="0 0 25 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
                <rect width="52.4464" height="9.38667" rx="4.69333" transform="matrix(0 -1 -1 0 17.08 59.5179)" fill="#A7A7A7"/>
            </g>
            <defs>
                <filter id="filter0_d" x="0.693329" y="0.0714111" width="23.3867" height="66.4464" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="3.5"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.654902 0 0 0 0 0.654902 0 0 0 0 0.654902 0 0 0 0.6 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
            </defs>
        </svg>

    )
};
