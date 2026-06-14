import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
        backgroundColor: '#ffffff',
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 30,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1d1d1f',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#86868b',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#0071e3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    navBar: {
        flexDirection: 'row',
        height: 54,
        borderTopWidth: 1,
        borderTopColor: '#e5e5ea',
        backgroundColor: '#fbfbfd',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navButton: {
        padding: 10,
        width: 60,
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 18,
        color: '#0071e3',
    },
    disabledButton: {
        opacity: 0.3,
    },
});
