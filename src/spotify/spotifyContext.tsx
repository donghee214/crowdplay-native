import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { useApolloClient } from '@apollo/react-hooks'
import {
    auth,
    remote,
    ApiScope,
    SpotifyRemoteApi,
    PlayerState,
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
    authenticate: (options?: AuthOptions) => void;
    endSession: () => void;
    connectRemote: () => void;
    renewSession: (refresh_token: string) => void;
    withRenew: (spotifyCallback: () => void) => void,
    remote: SpotifyRemoteApi,
}

export interface SessionProps {
    accessToken: string;
    expirationDate: string;
    refreshToken?: string;
}

import { CLIENT_ID, REDIRECT_URL, TOKEN_REFRESH_URL } from 'react-native-dotenv'

const SPOTIFY_SERVER = TOKEN_REFRESH_URL

export const config = {
    clientID: CLIENT_ID,
    redirectURL: REDIRECT_URL,
    tokenRefreshURL: `${SPOTIFY_SERVER}/refresh`,
    tokenSwapURL: `${SPOTIFY_SERVER}/swap`,
    scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserReadPrivateScope, ApiScope.UserReadEmailScope],
};

const noop = () => { };

const DefaultContext: AppContextProps = {
    authenticate: noop,
    endSession: noop,
    connectRemote: noop,
    renewSession: noop,
    withRenew: noop,
    remote,
}

const SpotifyContext = React.createContext<AppContextProps>(DefaultContext);

const SpotifyContextProvider: React.FC = props => {
    const [isConnected, setIsConnected] = useState(false)
    const [token, setToken] = useState('')
    const [playerState, setPlayerState] = useState<PlayerState>()
    const apolloClient = useApolloClient()

    useEffect(() => {
        (async () => {
            const session: SessionProps = await getLocalSession()
            const accessToken = (session?.accessToken && !isExpired(session.expirationDate)) ? session.accessToken : ""
            setToken(accessToken)
        })()
        return () => {
            remote.removeAllListeners()
        }
    }, [])

    const isExpired = (expirationDate: string) => {
        const expirationDateTime = Date.parse(expirationDate)
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

    const renewSession = async () => {
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
            const json = await response.json()
            setToken(json.access_token)
        }
        else {
            await authenticate()
        }
    }

    const authenticate = async () => {
        await endSession()
        const session = await auth.authorize(config)
        setToken(session.refreshToken)
        await saveSessionLocally(session)
    }

    const endSession = async () => {
        await remote.disconnect()
        await auth.endSession()
        setToken('')
        setIsConnected(false)
    }

    const onConnected = () => {
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
            if(graphQLErrors){
                graphQLErrors.map(async (error: any) => {
                    if(error.extensions.code === "UNAUTHENTICATED"){
                        await renewSession()
                        await connectRemote()
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
                remote.connect(token);
            }
            catch (err) {
                await renewSession()
                await connectRemote()
            }
            remote.on("remoteConnected", onConnected)
                .on("remoteDisconnected", onDisconnected)
                .on("playerStateChanged", onPlayerStateChanged)
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