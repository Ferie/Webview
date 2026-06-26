import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import App from '../src/app/index';

// Mock di react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    return {
        SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
        SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
        useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
});

// Mock di react-native-webview
jest.mock('react-native-webview', () => {
    const { View } = require('react-native');
    return { WebView: (props: any) => <View {...props} /> };
});

// Mock di expo-web-browser richiesto per i link legali
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
}));

// Mock obbligatorio per le icone di Expo durante i test
jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        Ionicons: (props: any) => <Text>{props.name}</Text>,
    };
});

describe('App Advanced Features Tests', () => {
    it('Dovrebbe mostrare il pulsante delle impostazioni e permettere lo switch di schermata', () => {
        const { getByTestId, queryByText, getByText } = render(<App />);

        // Controlliamo che il pulsante della scheda impostazioni esista tramite ID
        const settingsTabButton = getByTestId('settings-tab-button');
        expect(settingsTabButton).toBeTruthy();

        // All'avvio la parola "Impostazioni" NON deve essere visibile (siamo nel browser)
        expect(queryByText('Impostazioni')).toBeNull();

        // Clicchiamo sulla scheda impostazioni
        fireEvent.press(settingsTabButton);

        // Controlliamo elementi che esistono davvero nella schermata principale Impostazioni
        expect(getByText('Impostazioni')).toBeTruthy();
        expect(getByText('Tema Scuro')).toBeTruthy();
        expect(getByText('Note Legali')).toBeTruthy();
    });
});

describe('App Native Legal Pages Tests', () => {
    it('Dovrebbe permettere di navigare nella Privacy Policy e nei Termini e tornare indietro', () => {
        const { getByText, getByTestId } = render(<App />);

        // Apre la scheda impostazioni
        fireEvent.press(getByTestId('settings-tab-button'));
        expect(getByText('Privacy Policy')).toBeTruthy();

        // Apre la Privacy Policy nativa
        fireEvent.press(getByText('Privacy Policy'));
        expect(screen.getByTestId('privacy-title')).toBeTruthy();
        expect(getByText(/In conformità con le normative vigenti \(GDPR\)/)).toBeTruthy();

        // Torna alle impostazioni
        fireEvent.press(getByText(/Indietro/i));
        expect(getByText('Termini e Condizioni')).toBeTruthy();

        // Apre i Termini e Condizioni nativi
        fireEvent.press(getByText('Termini e Condizioni'));
        expect(screen.getByTestId('terms-title')).toBeTruthy();
        expect(getByText(/Benvenuto su/i)).toBeTruthy();
        expect(getByText(/Informatica per tutti/i)).toBeTruthy();
    });
});
