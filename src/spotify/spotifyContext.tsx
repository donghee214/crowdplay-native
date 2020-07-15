import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    auth,
    remote,
    ApiScope,
    SpotifyRemoteApi,
    PlayerState,
    ApiConfig,
} from 'react-native-spotify-remote';

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

export interface AppContextProps extends AppContextState {
    authenticate: (options?: AuthOptions) => Promise<void>;
    endSession: () => Promise<void>;
    connectRemote: () => Promise<void>;
    renewSession: (refresh_token: string) => void;
    withRenew: (spotifyCallback: () => void) => void,
    remote: SpotifyRemoteApi,
}

export interface SessionProps {
    accessToken: string;
    expirationDate: string;
    refreshToken?: string;
}

import { CLIENT_ID, REDIRECT_URL, BACKEND_URL } from 'react-native-dotenv'

const SPOTIFY_SERVER = BACKEND_URL

export const config: ApiConfig = {
    // playURI: 'spotify:track:5inDa3sWj8zqJBOdj7Bjqc',
    clientID: CLIENT_ID,
    showDialog: false,
    redirectURL: REDIRECT_URL,
    tokenRefreshURL: `${SPOTIFY_SERVER}/refresh`,
    tokenSwapURL: `${SPOTIFY_SERVER}/swap`,
    scopes: [
        ApiScope.AppRemoteControlScope,
        ApiScope.UserReadPrivateScope,
        ApiScope.UserReadEmailScope,
        ApiScope.UserTopReadScope,
        ApiScope.UGCImageUploadScope,
        ApiScope.StreamingScope,
        ApiScope.UserReadCurrentlyPlayingScope,
        ApiScope.UserReadRecentlyPlayedScope
    ],
};

const noop = () => { };
const asyncNoop = async () => { }

const DefaultContext: AppContextProps = {
    authenticate: asyncNoop,
    endSession: asyncNoop,
    connectRemote: asyncNoop,
    renewSession: noop,
    withRenew: noop,
    remote,
}

const SpotifyContext = React.createContext<AppContextProps>(DefaultContext);

const SpotifyContextProvider: React.FC = props => {
    const [isConnected, setIsConnected] = useState(false)
    const [token, setToken] = useState("")
    const [playerState, setPlayerState] = useState<PlayerState>()

    useEffect(() => {
        (async () => {
            const session: SessionProps = await getLocalSession()
            const accessToken = (session?.accessToken && !isExpired(session.expirationDate)) ? session.accessToken : ""
            setToken(accessToken)
            if (!accessToken && session?.refreshToken) {
                await renewSession()
            }
            remote.on("remoteConnected", onConnected)
                .on("remoteDisconnected", onDisconnected)
                .on("playerStateChanged", onPlayerStateChanged)
        })()
        return () => {
            remote.removeAllListeners()
        }
    }, [])

    const isExpired = (expirationDate: string) => {
        const expirationDateTime = Date.parse(expirationDate)
        if (isNaN(expirationDateTime)) return true
        const currDateTime = new Date();
        return currDateTime.getTime() > expirationDateTime
    }

    const getLocalSession = async () => {
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

    const saveSessionLocally = async (session: SessionProps) => {
        try {
            AsyncStorage.setItem('@session', JSON.stringify(session))
        }
        catch (error) {
            console.error("Error saving session:", error)
            return
        }
    }

    const saveTokenLocally = async (refreshedSession: { access_token: string, expires_in: number }) => {
        let session: SessionProps = await getLocalSession()
        if (session) {
            session.accessToken = refreshedSession.access_token
            const currDateTime = new Date()
            currDateTime.setSeconds(currDateTime.getSeconds() + refreshedSession.expires_in)
            session.expirationDate = currDateTime.toISOString()
            saveSessionLocally(session)
        }
    }

    const renewSession = async () => {
        console.log('renew called')
        const { refreshToken } = await getLocalSession()
        if (refreshToken) {
            const response = await fetch(`${SPOTIFY_SERVER}/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            })
            const refreshedSession = await response.json()
            console.log('setting token', refreshedSession.access_token)
            setToken(refreshedSession.access_token)
            saveTokenLocally(refreshedSession)
        }
        else {
            await authenticate()
        }
    }
    // AsyncStorage.clear()
    const authenticate = async () => {
        await auth.endSession()
        const session = await auth.authorize(config)
        setToken(session.accessToken)
        await saveSessionLocally(session)
    }

    const endSession = async () => {
        await remote.disconnect()
        await auth.endSession()
        setIsConnected(false)
    }

    const onConnected = () => {
        console.log('CONNECTED')
        setIsConnected(true)
    }

    const onDisconnected = () => {
        setIsConnected(false)
    }

    const onPlayerStateChanged = (playerState: PlayerState) => {
        setPlayerState(playerState)
    };

    const withRenew = async (spotifyCallback: any) => {
        try {
            await spotifyCallback()
        }
        catch ({ operation, response, graphQLErrors, networkError, forward }) {
            if (graphQLErrors) {
                graphQLErrors.map(async (error: any) => {
                    if (error.extensions.code === "UNAUTHENTICATED") {
                        await renewSession()
                        // await connectRemote()
                        spotifyCallback()
                        return
                    }
                });
            }
        }
    }

    const connectRemote = async () => {
        if (token) {
            try {
                await remote.connect(token)
            }    
            catch (err) {
                await authenticate()
                await remote.connect(token)
            }
            const currentPlayerState = await remote.getPlayerState()
            setPlayerState(currentPlayerState)
        }
    }

    return (
        <SpotifyContext.Provider
            value={{
                ...DefaultContext,
                isConnected,
                token,
                playerState,
                authenticate,
                endSession,
                connectRemote,
                withRenew
            }}>
            {props.children}
        </SpotifyContext.Provider>
    )

}

export default SpotifyContext;
export { SpotifyContextProvider };