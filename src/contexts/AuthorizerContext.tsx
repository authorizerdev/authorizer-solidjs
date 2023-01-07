import { Authorizer } from '@authorizerdev/authorizer-js';
import { createContext, createEffect, createMemo, onCleanup, useContext } from 'solid-js';
import type { ParentComponent } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { User, AuthToken } from '@authorizerdev/authorizer-js';

import type { Context, AuthorizerState } from 'src/types';

const AuthorizerContext = createContext<Context>([
  {
    config: {
      authorizerURL: '',
      redirectURL: '/',
      clientID: '',
      is_google_login_enabled: false,
      is_github_login_enabled: false,
      is_facebook_login_enabled: false,
      is_linkedin_login_enabled: false,
      is_apple_login_enabled: false,
      is_twitter_login_enabled: false,
      is_email_verification_enabled: false,
      is_basic_authentication_enabled: false,
      is_magic_link_login_enabled: false,
      is_sign_up_enabled: false,
      is_strong_password_enabled: true,
    },
    user: null,
    token: null,
    loading: false,
  },
  {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setLoading: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setToken: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUser: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAuthData: () => {},
    authorizer: new Authorizer({
      authorizerURL: 'http://localhost:8080',
      redirectURL: 'http://localhost:8080',
      clientID: '',
    }),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    logout: async () => {},
  },
]);

type AuthorizerProviderProps = {
  authorizerURL: string;
  redirectURL: string;
  clientID: string;
  onStateChangeCallback?: (stateData: AuthorizerState) => void;
};

export const AuthorizerProvider: ParentComponent<AuthorizerProviderProps> = (props) => {
  const [state, setState] = createStore<AuthorizerState>({
    user: null,
    token: null,
    loading: true,
    config: {
      authorizerURL: props.authorizerURL,
      redirectURL: props.redirectURL,
      clientID: props.clientID,
      is_google_login_enabled: false,
      is_github_login_enabled: false,
      is_facebook_login_enabled: false,
      is_linkedin_login_enabled: false,
      is_apple_login_enabled: false,
      is_twitter_login_enabled: false,
      is_email_verification_enabled: false,
      is_basic_authentication_enabled: false,
      is_magic_link_login_enabled: false,
      is_sign_up_enabled: false,
      is_strong_password_enabled: true,
    },
  });

  const authorizer = createMemo(
    () =>
      new Authorizer({
        authorizerURL: props.authorizerURL,
        redirectURL: props.redirectURL,
        clientID: props.clientID,
      }),
  );

  let interval: number | null = null;

  const getToken = async () => {
    setState('loading', true);
    const metaRes = await authorizer().getMetaData();

    try {
      const res = await authorizer().getSession();
      if (res.access_token && res.user) {
        setState((prev) => ({
          ...prev,
          token: {
            access_token: res.access_token,
            expires_in: res.expires_in,
            id_token: res.id_token,
            refresh_token: res.refresh_token || '',
          },
          user: res.user,
        }));

        if (interval) {
          clearInterval(interval);
        }

        interval = setInterval(() => {
          getToken();
        }, res.expires_in * 1000);
      } else {
        setState((prev) => ({ ...prev, user: null, token: null }));
      }
    } catch (e) {
      setState((prev) => ({ ...prev, user: null, token: null }));
    } finally {
      setState('config', (config) => ({ ...config, ...metaRes }));
      setState('loading', false);
    }
  };

  createEffect(() => {
    if (props.onStateChangeCallback) {
      props.onStateChangeCallback(state);
    }
  });

  // Actions
  const setLoading = (loading: boolean) => {
    setState('loading', loading);
  };

  const handleTokenChange = (token: AuthToken | null) => {
    setState('token', token);

    // If we have an access_token, then we clear the interval and create a new interval
    // to the token expires_in, so we can retrieve the token again before it expires
    if (token?.access_token) {
      if (interval) {
        clearInterval(interval);
      }

      interval = setInterval(() => {
        getToken();
      }, token.expires_in * 1000);
    }
  };

  const setUser = (user: User | null) => {
    setState('user', user);
  };

  const setAuthData = (data: AuthorizerState) => {
    setState(data);
  };

  const logout = async () => {
    setState('loading', true);
    setState('user', null);
  };

  createEffect(() => {
    getToken();
  });

  onCleanup(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

  return (
    <AuthorizerContext.Provider
      value={[
        state,
        {
          setUser,
          setLoading,
          setToken: handleTokenChange,
          setAuthData,
          authorizer: authorizer(),
          logout,
        },
      ]}
    >
      {props.children}
    </AuthorizerContext.Provider>
  );
};

export const useAuthorizer = () => useContext(AuthorizerContext);
