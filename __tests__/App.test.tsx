import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/app/App'; // Corretto secondo la tua nuova struttura in src

// 1. Mock di react-native-safe-area-context richiesto per i test di layout
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
        SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
        useSafeAreaInsets: () => inset,
    };
});

// 2. Mock completo di react-native-webview per Jest
jest.mock('react-native-webview', () => {
    const { View } = require('react-native');
    return {
        WebView: (props: any) => {
            // Simuliamo la WebView usando una View nativa standard accettata da Jest
            return <View testID={props.testID || 'mocked-webview'} {...props} />;
        },
    };
});

describe('App Component Tests', () => {

    it('Dovrebbe renderizzare correttamente l\'applicazione senza crash', () => {
        const { toJSON } = render(<App />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('Dovrebbe mostrare la barra di navigazione inferiore', () => {
        const { getByTestId } = render(<App />);
        const navBar = getByTestId('nav-bar');
        expect(navBar).toBeTruthy();
    });

    it('I pulsanti Avanti e Indietro dovrebbero essere disabilitati all\'avvio (senza cronologia)', () => {
        const { getByTestId } = render(<App />);

        const backButton = getByTestId('back-button');
        const forwardButton = getByTestId('forward-button');

        expect(backButton.props.accessibilityState.disabled).toBe(true);
        expect(forwardButton.props.accessibilityState.disabled).toBe(true);
    });

    it('I pulsanti Home e Refresh dovrebbero essere sempre attivi', () => {
        const { getByTestId } = render(<App />);

        const homeButton = getByTestId('home-button');
        const refreshButton = getByTestId('refresh-button');

        expect(homeButton.props.accessibilityState?.disabled).not.toBe(true);
        expect(refreshButton.props.accessibilityState?.disabled).not.toBe(true);
    });
});
