import { StyleSheet } from 'react-native';

// Colori per il Tema Chiaro
export const lightColors = {
    background: '#ffffff',
    text: '#1d1d1f',
    subText: '#86868b',
    navBg: '#fbfbfd',
    border: '#e5e5ea',
    accent: '#0071e3',
};

// Colori per il Tema Scuro
export const darkColors = {
    background: '#1c1c1e',
    text: '#f5f5f7',
    subText: '#aeaeeb',
    navBg: '#2c2c2e',
    border: '#3a3a3c',
    accent: '#0a84ff',
};

export const createStyles = (colors: typeof lightColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 30
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center'
    },
    errorText: {
        fontSize: 14,
        color: colors.subText,
        textAlign: 'center',
        marginBottom: 20
    },
    retryButton: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },

    // Barra Inferiore
    navBar: {
        flexDirection: 'row',
        height: 54,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.navBg,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navButton: {
        padding: 10,
        width: 50,
        alignItems: 'center'
    },
    navButtonText: {
        fontSize: 18,
        color: colors.accent
    },
    activeNavButtonText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: 'bold'
    },
    disabledButton: {
        opacity: 0.3
    },

    // Schermata Impostazioni
    settingsContent: {
        flex: 1, padding: 20
    },
    settingsTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 25
    },
    sectionCard: {
        backgroundColor: colors.navBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: '600',
        color: colors.subText,
        marginBottom: 12,
        textTransform: 'uppercase'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    rowText: {
        fontSize: 16,
        color: colors.text
    },
    linkText: {
        fontSize: 16,
        color: colors.accent,
        fontWeight: '500'
    },
    versionText: {
        fontSize: 14,
        color: colors.subText,
        textAlign: 'center',
        marginTop: 10
    }
});
