import { createReduxStore } from '@wordpress/data';
import { getAuthenticationStateFromLocalStorage, setAuthenticationStateInLocalStorage } from '../utils/auth';

export const initialState = {
    isDrawerOpen: false,
    shouldRenderStandalone: false,
    isInitialStateLoaded: false,
    registeredPlugins: {},
    query: null,
    isAuthenticated: getAuthenticationStateFromLocalStorage()
};

export const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case 'SET_RENDER_STANDALONE':
            return {
                ...state,
                shouldRenderStandalone: action.shouldRenderStandalone,
            };
        case 'SET_QUERY':
            return {
                ...state,
                query: action.query,
            };
        case 'SET_DRAWER_OPEN':
            return {
                ...state,
                isDrawerOpen: action.isDrawerOpen,
            };
        case 'SET_INITIAL_STATE_LOADED':
            return {
                ...state,
                isInitialStateLoaded: true,
            };
        case 'REGISTER_PLUGIN':
            return {
                ...state,
                registeredPlugins: {
                    ...state.registeredPlugins,
                    [ action.name ]: action.config,
                },
            };
        case 'TOGGLE_AUTHENTICATION':
            console.log('Action received in reducer');
            return {
                ...state,
                isAuthenticated: !state.isAuthenticated,
            };
        default:
            return state;
    }
};

export const actions = {
    setQuery: ( query ) => {
        return {
            type: 'SET_QUERY',
            query,
        };
    },
    setDrawerOpen: ( isDrawerOpen ) => {
        return {
            type: 'SET_DRAWER_OPEN',
            isDrawerOpen,
        };
    },
    setShouldRenderStandalone: ( shouldRenderStandalone ) => {
        return {
            type: 'SET_RENDER_STANDALONE',
            shouldRenderStandalone,
        };
    },
    setInitialStateLoaded: () => {
        return {
            type: 'SET_INITIAL_STATE_LOADED',
        };
    },
    registerPlugin: ( name, config ) => {
        return {
            type: 'REGISTER_PLUGIN',
            name,
            config,
        };
    },
    toggleAuthentication: () => (dispatch, getState) => {
        console.log('Action: Toggling authentication');
        dispatch({ type: 'TOGGLE_AUTHENTICATION' });

        const newState = getState();
        setAuthenticationStateInLocalStorage(newState.isAuthenticated);
    },
};

export const selectors = {
    getQuery: state => state.query,
    isDrawerOpen: state => state.isDrawerOpen,
    shouldRenderStandalone: state => state.shouldRenderStandalone,
    isInitialStateLoaded: state => state.isInitialStateLoaded,
    getPluginsArray: state => Object.values(state.registeredPlugins),
    isAuthenticated: state => state.isAuthenticated,
};

export const store = createReduxStore( 'wpgraphql-ide', {
    reducer,
    selectors,
    actions,
});
