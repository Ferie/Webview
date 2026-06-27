# Informatica per Tutti - WebView Mobile App

Benvenuti nel repository ufficiale della **WebView di Informatica per Tutti**, un'applicazione mobile nativa sviluppata con **React Native** ed **Expo (SDK 56)**. 

L'applicazione è progettata come un contenitore WebView ottimizzato per incapsulare e mostrare in modo fluido, sicuro e performante i contenuti del blog ufficiale [IPT - Informatica per Tutti](https://ferie.altervista.org/wordpress/).

## 📱 Caratteristiche Principali

- **WebView Avanzata**: Integrazione completa del blog con abilitazione di DOM Storage, cache e supporto cookie condivisi.
- **Iniezione JavaScript Dinamica**: Uno script personalizzato rimuove automaticamente banner pubblicitari invadenti e i riferimenti/footer della piattaforma di hosting di Altervista all'avvio dell'app per garantire un look pulito e 100% proprietario.
- **Gestione del Tema (Chiaro/Scuro)**: Un'impostazione nativa permette di switchare l'interfaccia dell'app (barra di navigazione, schermate info e sfondi di sistema) tra Modalità Chiara e Modalità Scura.
- **Pagine Legali Native In-App**: Schermate integrate per la *Privacy Policy* (conforme GDPR e coordinata con la policy Iubenda del sito) e i *Termini e Condizioni*, eliminando rallentamenti e garantendo la piena approvazione su Google Play Store e Apple App Store.
- **Gestione nativa tasto Indietro**: Integrazione nativa del tasto indietro di Android per navigare la cronologia dei link del blog prima di uscire dall'app.
- **Unit Testing Robusto**: Suite di test automatizzata con **Jest** e `@testing-library/react-native` che fa uso dell'oggetto `screen` e di asserzioni tramite `testID` per validare le rotte legali e lo stato dei componenti.

## 🛠️ Tecnologie Utilizzate

- **React Native** (v0.85) & **Expo SDK 56**
- **TypeScript** per la tipizzazione statica del codice
- **React Native WebView** per il motore di rendering web
- **Jest** & **React Native Testing Library** per i test di regressione

## 📂 Struttura del Progetto

```text
Webview/
├── assets/
│   ├── icons/               # Icone di sistema
│   ├── images/              # Immagini e Splash Screen dell'app
├── src/
│   ├── app/
│   │   └── index.tsx        # Entry point dell'applicazione (Interfaccia e Logica)
│   └── styles/
│       └── styles.ts        # Palette colori e stili dinamici (Light/Dark)
├── __tests__/
│   └── App.test.tsx         # Unit test automatizzati per Jest
├── app.json                 # Configurazione nativa Expo (Splash Screen e Meta)
├── jest.config.js           # Configurazione dell'ambiente di test
└── package.json             # Dipendenze e script npm
```

## 🚀 Come Avviare il Progetto in Locale

### Prerequisiti
Assicurarsi di avere installato Node.js e l'applicazione Expo Go sullo smartphone (iOS o Android).

### Avviamento in locale
1. Clonare il repository:

    ```Bash
    git clone [https://github.com/Ferie/Webview.git](https://github.com/Ferie/Webview.git)
    cd Webview
    ```

2. Installare le dipendenze:

    ```Bash
    npm install
    ```

3. Avviare il server di sviluppo pulendo la cache:

    ```Bash
    npx expo start -c
    ```

4. Avviare sui simulatori o dispositivi fisici:

    - Premere `a` nel terminale per aprire l'emulatore Android Studio.

    - Premere `i` nel terminale per aprire il simulatore iOS (Xcode).

    - Inquadrare il codice QR generato nel terminale con la fotocamera (iOS) o con l'app Expo Go (Android).

## 🧪 Esecuzione dei Test
I test sono configurati per verificare la stabilità dell'applicazione, il comportamento dei pulsanti della barra inferiore e la corretta apertura delle pagine legali.

Per lanciare la suite di test in modalità interattiva (Watch Mode):

```Bash
npm run test
```

Per aggiornare o generare nuovamente gli snapshot di Jest:

```Bash
npx jest -u
```

## ⚖️ Note sulla Conformità per gli Store
L'applicazione è configurata per superare i controlli della linea guida Apple 4.2.2 (Minimum Functionality) grazie a un'interfaccia di navigazione nativa circostante, un sistema di gestione aspetto e pagine informative interamente scritte nel codice dell'app.

## 📄 Licenza
Questo progetto è di proprietà esclusiva di Riccardo Andreatta in quanto titolare del blog **Informatica per tutti** ([https://ferie.altervista.org/wordpress/](https://ferie.altervista.org/wordpress/)).

Il codice viene rilasciato a scopo puramente illustrativo e di consultazione. 

È vietata la riproduzione, la duplicazione o la ridistribuzione commerciale senza autorizzazione.
