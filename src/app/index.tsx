import React, { useRef, useState, useEffect } from 'react';
import {
    Text,
    View,
    StatusBar,
    ActivityIndicator,
    BackHandler,
    Platform,
    TouchableOpacity,
    Switch,
    ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { createStyles, lightColors, darkColors } from '../styles/styles';
import { Ionicons } from '@expo/vector-icons';

const HOME_URL = 'https://ferie.altervista.org/wordpress/';

// Definiamo i quattro possibili stati della schermata
type TabType = 'browser' | 'settings' | 'privacy' | 'terms';
type ThemeType = 'light' | 'dark';

export default function App() {
    const webViewRef = useRef<WebView>(null);
    const [currentTab, setCurrentTab] = useState<TabType>('browser');
    const [theme, setTheme] = useState<ThemeType>('light');
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);

    const currentColors = theme === 'light' ? lightColors : darkColors;
    const styles = createStyles(currentColors);

    // Gestione della pulizia nativa del tasto indietro (Android)
    useEffect(() => {
        if (Platform.OS === 'android') {
            const onBackPress = (): boolean => {
                // Se siamo nelle sotto-pagine legali, torna alle impostazioni
                if (currentTab === 'privacy' || currentTab === 'terms') {
                    setCurrentTab('settings');
                    return true;
                }
                // Se siamo nelle impostazioni, torna al browser
                if (currentTab === 'settings') {
                    setCurrentTab('browser');
                    return true;
                }
                // Se siamo nel browser e si può andare indietro nella cronologia del sito
                if (webViewRef.current && canGoBack && currentTab === 'browser') {
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
    }, [canGoBack, currentTab]);

    // JAVASCRIPT INJECTION: Rimuove pubblicità, note legali e altri riferimenti ad Altervista da pagina, menu laterale e widget salvando i bottoni Social
    const injectedJavaScript = `
    (function () {
        const cleanup = () => {
            // Rimozione banner pubblicitari e i widget invasivi
            const globalAds = [
                '#av-footer',
                '.av-footer',
                '.altervista-banner',
                '#alexa-widget',
                'iframe[id*="google_ads"]',
                '.adsbygoogle'
            ];

            globalAds.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.setProperty('display', 'none', 'important');
                });
            });

            // Scansione dei soli nodi di testo per eliminare i link di Altervista
            const walkTextNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue.trim();

                    // Controllo del testo esatto presente nei link del footer del tema di Altervista
                    if (
                        text.includes('Altervista') ||
                        text.includes('Apri un sito') ||
                        text.includes('Segnala abuso') ||
                        text.includes('Disclaimer') ||
                        text.includes('Gestisci preferenze') ||
                        text.includes('Tema Seamless') ||
                        text.includes('Privacy Policy')
                    ) {
                        // Trova il tag genitore e lo nasconde completamente
                        if (node.parentNode && node.parentNode.style) {
                            // Rimuove l'elemento solo se si trova nel footer per evitare di nascondere testo utile agli articoli
                            const isInsideFooter = node.parentNode.closest('footer, .site-info, .footer-copy, aside, .sidebar-footer');

                            if (isInsideFooter || text.includes('Privacy Policy') || text.includes('Disclaimer')) {
                                node.parentNode.style.setProperty('display', 'none', 'important');
                                node.parentNode.style.setProperty('pointer-events', 'none', 'important');
                            }
                        }
                    }

                    // Pulizia dei trattini separatore "·" o "-"
                    if ((text === '·' || text === '-' || text === '|') && node.parentNode) {
                        const parentText = node.parentNode.textContent || '';
                        if (parentText.includes('Disclaimer') || parentText.includes('Segnala abuso') || parentText.includes('Privacy Policy')) {
                            node.nodeValue = '';
                        }
                    }
                } else {
                    // Evitia il blocco dei bottoni social
                    if (node instanceof HTMLElement && (node.className.includes('social') || node.className.includes('sharedaddy') || node.className.includes('share'))) {
                        return;
                    }

                    for (let child of node.childNodes) {
                        walkTextNodes(child);
                    }
                }
            };

            if (document.body) {
                walkTextNodes(document.body);
            }

            // Blocco della selezione del testo
            document.body.style.webkitUserSelect = 'none';
            document.body.style.userSelect = 'none';
        };

        // Controllo continuo per non impattare sulle prestazioni
        cleanup();
        setInterval(cleanup, 400);
    })();
    true;
  `;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
                    backgroundColor={currentColors.background}
                />

                {/* TAB 1: BROWSER WEB (CON INIEZIONE JS) */}
                {currentTab === 'browser' && (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: HOME_URL }}
                        style={styles.webview}
                        incognito={false}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        injectedJavaScript={injectedJavaScript} // Attivazione dello script di pulizia
                        onNavigationStateChange={(navState) => {
                            setCanGoBack(navState.canGoBack);
                            setCanGoForward(navState.canGoForward);
                        }}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={currentColors.accent} />
                            </View>
                        )}
                        renderError={() => (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorTitle}>Ops! Errore di connessione</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={() => webViewRef.current?.reload()}>
                                    <Text style={styles.retryButtonText}>Riprova</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                {/* TAB 2: IMPOSTAZIONI PRINCIPALI */}
                {currentTab === 'settings' && (
                    <ScrollView style={styles.settingsContent}>
                        <Text style={styles.settingsTitle}>Impostazioni</Text>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Aspetto</Text>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Tema Scuro</Text>
                                <Switch
                                    value={theme === 'dark'}
                                    onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                                    trackColor={{ false: '#767577', true: currentColors.accent }}
                                    thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                                />
                            </View>
                        </View>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Note Legali</Text>
                            <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => setCurrentTab('privacy')}>
                                <Text style={styles.rowText}>Privacy Policy</Text>
                                <Text style={styles.linkText}>Visualizza 〉</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.row} onPress={() => setCurrentTab('terms')}>
                                <Text style={styles.rowText}>Termini e Condizioni</Text>
                                <Text style={styles.linkText}>Visualizza 〉</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Informazioni</Text>
                            <View style={[styles.row, styles.rowBorder]}>
                                <Text style={styles.rowText}>Applicazione</Text>
                                <Text style={[styles.rowText, { color: currentColors.subText }]}>Ferie Blog App</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowText}>Sito Web</Text>
                                <Text style={[styles.rowText, { color: currentColors.subText }]}>ferie.altervista.org</Text>
                            </View>
                        </View>
                        <Text style={styles.versionText}>Versione 1.0.0 (Build 1)</Text>
                    </ScrollView>
                )}

                {/* PAGINA NATIVA PRIVACY POLICY */}
                {currentTab === 'privacy' && (
                    <ScrollView style={styles.settingsContent}>
                        <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => setCurrentTab('settings')}>
                            <Text style={{ color: currentColors.accent, fontSize: 16 }}>❮ Indietro</Text>
                        </TouchableOpacity>
                        <Text style={styles.settingsTitle} testID="privacy-title">Privacy Policy</Text>
                        <View style={styles.sectionCard}>
                            <Text style={[styles.rowText, { lineHeight: 22 }]}>
                                In conformità con le normative vigenti (GDPR), questa applicazione mobile denominata "Webview di Informatica per Tutti" è configurata esclusivamente come contenitore in modalità WebView per mostrare i contenuti del blog di informazione personale.{"\n\n"}
                                <Text style={{ fontWeight: 'bold' }}>1. Trattamento dei dati: </Text>
                                L'applicazione in sé, nella sua componente nativa scaricata sul dispositivo, NON raccoglie, NON memorizza e NON trasmette a server terzi alcun dato personale dell'utente (come posizione geografica, contatti, ID univoci del telefono o dati di utilizzo).{"\n\n"}
                                <Text style={{ fontWeight: 'bold' }}>2. Navigazione Web: </Text>
                                Trattandosi di una WebView, la navigazione all'interno del blog segue le medesime policy di trattamento dei dati e gestione dei Cookie del sito web di origine, gestito tramite la piattaforma e i servizi esterni (come la cookie policy ufficiale registrata tramite Iubenda per il sito{" "}
                                <Text style={{ fontStyle: 'italic' }}>https://ferie.altervista.org</Text>
                                {" "}che è possibile consultare al seguente indirizzo{" "}
                                <Text style={{ fontStyle: 'italic' }}>https://www.iubenda.com/privacy-policy/941164</Text>).
                            </Text>
                        </View>
                    </ScrollView>
                )}

                {/* PAGINA NATIVA TERMINI E CONDIZIONI */}
                {currentTab === 'terms' && (
                    <ScrollView style={styles.settingsContent}>
                        <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => setCurrentTab('settings')}>
                            <Text style={{ color: currentColors.accent, fontSize: 16 }}>❮ Indietro</Text>
                        </TouchableOpacity>
                        <Text style={styles.settingsTitle} testID="terms-title">Termini e Condizioni</Text>
                        <View style={styles.sectionCard}>
                            <Text style={[styles.rowText, { lineHeight: 22 }]}>
                                Benvenuto su "Webview di Informatica per Tutti". L'accesso e l'uso di questa applicazione sono regolati dai presenti Termini e Condizioni.{"\n\n"}
                                <Text style={{ fontWeight: 'bold' }}>1. Diritti d'autore: </Text>
                                Tutti i testi, gli articoli, le immagini e i contenuti presenti e visualizzati all'interno dell'applicazione appartengono al titolare del blog ferie.altervista.org e sono protetti dalle leggi sul diritto d'autore. È vietata la riproduzione anche parziale senza autorizzazione.{"\n\n"}
                                <Text style={{ fontWeight: 'bold' }}>2. Limitazione di responsabilità: </Text>
                                I contenuti pubblicati hanno carattere puramente informativo ed editoriale. Lo sviluppatore e il titolare del blog non si assumono alcuna responsabilità per errori, omissioni o per l'uso improprio delle informazioni lette.{"\n\n"}
                                <Text style={{ fontWeight: 'bold' }}>3. Modifiche: </Text>
                                Il titolare si riserva il diritto di modificare i contenuti del blog e i presenti termini in qualsiasi momento e senza preavviso.
                            </Text>
                        </View>
                    </ScrollView>
                )}

                {/* BARRA DI NAVIGAZIONE INFERIORE */}
                <View style={styles.navBar}>
                    {/* Pulsante Indietro (Freccia Sinistra) */}
                    <TouchableOpacity
                        style={[styles.navButton, (!canGoBack || currentTab !== 'browser') && styles.disabledButton]}
                        disabled={!canGoBack || currentTab !== 'browser'}
                        onPress={() => webViewRef.current?.goBack()}
                    >
                        <Ionicons
                            name="chevron-back-outline"
                            size={24}
                            color={currentTab === 'browser' && canGoBack ? currentColors.accent : currentColors.subText}
                        />
                    </TouchableOpacity>

                    {/* Pulsante Browser (Icona Bussola / Esplora) */}
                    <TouchableOpacity
                        testID="browser-tab-button"
                        style={styles.navButton}
                        onPress={() => setCurrentTab('browser')}
                    >
                        <Ionicons
                            name={currentTab === 'browser' ? "compass" : "compass-outline"}
                            size={26}
                            color={currentTab === 'browser' ? currentColors.accent : currentColors.subText}
                        />
                    </TouchableOpacity>

                    {/* Pulsante Impostazioni (Icona Ingranaggio / Opzioni) */}
                    <TouchableOpacity
                        testID="settings-tab-button"
                        style={styles.navButton}
                        onPress={() => setCurrentTab('settings')}
                    >
                        <Ionicons
                            name={(currentTab === 'settings' || currentTab === 'privacy' || currentTab === 'terms') ? "settings" : "settings-outline"}
                            size={25}
                            color={(currentTab === 'settings' || currentTab === 'privacy' || currentTab === 'terms') ? currentColors.accent : currentColors.subText}
                        />
                    </TouchableOpacity>

                    {/* Pulsante Avanti (Freccia Destra) */}
                    <TouchableOpacity
                        style={[styles.navButton, (!canGoForward || currentTab !== 'browser') && styles.disabledButton]}
                        disabled={!canGoForward || currentTab !== 'browser'}
                        onPress={() => webViewRef.current?.goForward()}
                    >
                        <Ionicons
                            name="chevron-forward-outline"
                            size={24}
                            color={currentTab === 'browser' && canGoForward ? currentColors.accent : currentColors.subText}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
