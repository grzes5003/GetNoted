export const defaultThemeStyles = {
    light: {
        general: {
            backgroundPrimary: "#3F72AF",
            backgroundSecondary: "#112D4E",
        },
        extended: {
            lightBright: "#F9C784",
            darkBritht: "#FC7A1E",
            mediumDark: "#485696",
        }
    }

};

export const cssThemeVars = ({
                                 general,
                                extended,
                             }) => {
    return {
        // general
        '--home-bg-color-primary': general.backgroundPrimary,
        '--home-bg-color-secondary': general.backgroundSecondary,

        // extended
        '--dot-color-primary': extended.lightBright,
    }
};
