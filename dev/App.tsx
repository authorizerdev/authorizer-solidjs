import { AuthToken } from '@authorizerdev/authorizer-js';
import { Match, Switch } from 'solid-js';
import type { Component } from 'solid-js';
import { useAuthorizer } from '../src';

const App: Component = () => {
  const [state, { authorizer, setUser, setToken }] = useAuthorizer();

  const login = async () => {
    try {
      const response: AuthToken | void = await authorizer.login({
        email: 'helios25+1@gmail.com',
        password: 'Test1234$',
      });

      if (response) {
        if (response.user) {
          setUser(response.user);
        }

        if (response.access_token) {
          setToken(response);
        }
      }
    } catch (e) {
      // TODO handle errors properly
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await authorizer.logout();
      setUser(null);
    } catch (e) {
      // TODO handle errors properly
      console.error(e);
    }
  };

  return (
    <>
      <Switch fallback={<div>loading...</div>}>
        <Match when={!state.user && !state.loading} keyed={true}>
          <div>
            <h3>Login</h3>
            <button onClick={login}>Login</button>
          </div>
        </Match>
        <Match when={state.user && !state.loading} keyed={false}>
          <div>
            <header>
              <button onClick={logout}>Log out</button>
              <h1>user</h1>
              <p>Email: {state.user?.email}</p>
            </header>
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default App;
