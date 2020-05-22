import React from 'react';
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {
    auth,
    remote,
    ApiScope,
    SpotifyRemoteApi,
    PlayerState,
} from 'react-native-spotify-remote';

import { CLIENT_ID, REDIRECT_URL, TOKEN_REFRESH_URL } from 'react-native-dotenv'

const SPOTIFY_SERVER = TOKEN_REFRESH_URL

const config = {
    clientID: CLIENT_ID,
    redirectURL: REDIRECT_URL,
    tokenRefreshURL: `${SPOTIFY_SERVER}/refresh`,
    tokenSwapURL: `${SPOTIFY_SERVER}/swap`,
    scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserReadPrivateScope, ApiScope.UserReadEmailScope],
};

interface AuthOptions {
    playURI?: string;
    showDialog?: boolean;
    autoConnect?: boolean;
}

interface AppContextState {
    error?: string;
    playerState?: PlayerState;
    token?: string;
    isConnected?: boolean;
    isAuthenticated?: boolean;
}

export interface SessionProps {
    accessToken: string;
    expirationDate: string;
    refreshToken?: string;
}

export interface AppContextProps extends AppContextState {
    authenticate: (options?: AuthOptions) => void;
    endSession: () => void;
    connectRemote: () => void;
    renewSession: (refresh_token: string) => void;
    remote: SpotifyRemoteApi,
}

const noop = () => { };

const DefaultContext: AppContextProps = {
    authenticate: noop,
    endSession: noop,
    connectRemote: noop,
    renewSession: noop,
    remote,
}

const SpotifyContext = React.createContext<AppContextProps>(DefaultContext);

class SpotifyContextProvider extends React.Component<{}, AppContextState> {
    state = {
        isConnected: false,
        token: ""
    }

    async componentDidMount() {
        const session: SessionProps = await this.getLocalSession()
        const accessToken = (session?.accessToken && !this.isExpired(session.expirationDate)) ? session.accessToken : ""
        this.setState((state) => ({
            ...state,
            token: accessToken,
        }))
    }

    componentWillUnmount() {
        remote.removeAllListeners();
    }

    private renewSession = async () => {
        const { refresh_token } = await this.getLocalSession()
        if (refresh_token) {
            const response = await fetch(`${SPOTIFY_SERVER}/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token
                })
            })
            const json = await response.json()
            this.setState((state) => ({
                ...state,
                token: json.access_token
            }))
        }
        else {
            await this.authenticate()
        }
    }

    private isExpired = (expirationDate: string) => {
        const expirationDateTime = Date.parse(expirationDate)
        const currDateTime = new Date();
        return currDateTime.getTime() > expirationDateTime
    }

    private onConnected = () => {
        this.setState((state) => ({
            ...state,
            isConnected: true
        }));
    }

    private onDisconnected = () => {
        this.setState((state) => ({
            ...state,
            isConnected: false
        }));
    }

    private onPlayerStateChanged = (playerState: PlayerState) => {
        this.setState((state) => ({
            ...state,
            playerState
        }))
    };


    private getLocalSession = async () => {
        try {
            const sessionString = await AsyncStorage.getItem('@session')
            const session = JSON.parse(sessionString!)
            return session ? session : null
        }
        catch (error) {
            console.error('Error fetching session from asyncStorage:', error)
            return null
        }
    }

    private saveSessionLocally = async (session: SessionProps) => {
        try {
            AsyncStorage.setItem('@session', JSON.stringify(session))
        }
        catch (error) {
            console.error("Error saving session:", error)
            return
        }
    }

    withRenew = async (spotifyCallback: () => void)  => {
        try {
            spotifyCallback()
        }
        catch (error) {
            if (error.status === 401) {
                await this.renewSession()
                await this.connectRemote()
                spotifyCallback()
            }
        }
    }

    authenticate = async () => {
        await this.endSession()
        const session = await auth.authorize(config)
        this.setState((state) => ({
            ...state,
            token: session.accessToken
        }))
        await this.saveSessionLocally(session)
    }


    endSession = async () => {
        await remote.disconnect()
        await auth.endSession()
        this.setState((state) => ({
            ...state,
            isConnected: false,
            token: "",
        }))
    }

    connectRemote = async () => {
        if (this.state.token) {
            try {
                remote.connect(this.state.token);
            }
            catch (err) {
                await this.renewSession()
                await this.connectRemote()
            }
            remote.on("remoteConnected", this.onConnected)
                .on("remoteDisconnected", this.onDisconnected)
                .on("playerStateChanged", this.onPlayerStateChanged);
        }
    }

    render() {
        console.log('process')
        console.log(process.env.CLIENT_ID)
        const { children } = this.props
        return (
            <SpotifyContext.Provider
                value={{
                    ...DefaultContext,
                    ...this.state,
                    authenticate: this.authenticate,
                    endSession: this.endSession,
                    connectRemote: this.connectRemote,
                }}>
                {children}
            </SpotifyContext.Provider>
        )
    }
}

export default SpotifyContext;
export { SpotifyContextProvider };