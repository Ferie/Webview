import React, { useRef, useState, useEffect } from 'react';
import {
    Text,
    View,
    StatusBar,
    ActivityIndicator,
    BackHandler,
    Platform,
    TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { styles } from '../styles/styles'; // Importazione degli stili separati

const HOME_URL = 'https://ferie.altervista.org/';

export default function App() {
    const webViewRef = useRef<WebView>(null);
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);

    // Gestione tasto indietro per Android
    // Sostituisci il vecchio useEffect con questo:
    useEffect(() => {
        if (Platform.OS === 'android') {
            const onBackPress = (): boolean => {
                if (webViewRef.current && canGoBack) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            };

            // La nuova sintassi assegna il listener a una costante "subscription"
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // La funzione di pulizia ora usa .remove() direttamente sulla sottoscrizione
            return () => subscription.remove();
        }
    }, [canGoBack]);

    const injectedJavaScript = `
    document.body.style.webkitUserSelect = 'none';
    true;
  `;

    // Funzioni di navigazione della barra inferiore
    const handleGoBack = () => webViewRef.current?.goBack();
    const handleGoForward = () => webViewRef.current?.goForward();
    const handleReload = () => webViewRef.current?.reload();
    const handleGoHome = () => {
        webViewRef.current?.injectJavaScript(`window.location.href = '${HOME_URL}';`);
    };

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

                <WebView
                    ref={webViewRef}
                    source={{ uri: HOME_URL }}
                    style={styles.webview}
                    incognito={false}
                    domStorageEnabled={true}
                    sharedCookiesEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    injectedJavaScript={injectedJavaScript}
                    onNavigationStateChange={handleNavigationStateChange}
                    startInLoadingState={true}

                    renderLoading={() => (
                        <View style={styles.loadingContainer} testID="loading-spinner">
                            <ActivityIndicator size="large" color="#0071e3" />
                        </View>
                    )}

                    renderError={() => (
                        <View style={styles.errorContainer} testID="error-container">
                            <Text style={styles.errorTitle}>Ops! Qualcosa è andato storto</Text>
                            <Text style={styles.errorText}>Assicurati di essere connesso a Internet e riprova.</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={handleReload}
                                testID="retry-button"
                            >
                                <Text style={styles.retryButtonText}>Riprova</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                {/* BARRA DI NAVIGAZIONE */}
                <View style={styles.navBar} testID="nav-bar">
                    <TouchableOpacity
                        style={[styles.navButton, !canGoBack && styles.disabledButton]}
                        disabled={!canGoBack}
                        onPress={handleGoBack}
                        testID="back-button"
                    >
                        <Text style={styles.navButtonText}>◀</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={handleGoHome} testID="home-button">
                        <Text style={styles.navButtonText}>🏠</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navButton} onPress={handleReload} testID="refresh-button">
                        <Text style={styles.navButtonText}>🔄</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.navButton, !canGoForward && styles.disabledButton]}
                        disabled={!canGoForward}
                        onPress={handleGoForward}
                        testID="forward-button"
                    >
                        <Text style={styles.navButtonText}>▶</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
