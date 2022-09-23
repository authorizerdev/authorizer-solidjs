import { AuthToken, User } from '@authorizerdev/authorizer-js';
import { render } from 'solid-js/web';
import { AuthorizerProvider } from '../src';

import App from './App';

const handleOnStateChange = ({ user, token }: { user: User | null; token: AuthToken | null }) => {
  console.log('handleOnStateChange user', user);
  console.log('handleOnStateChange token', token);
};

render(
  () => (
    <AuthorizerProvider
      authorizerURL="https://owl-invoicing-auth.up.railway.app"
      redirectURL={window.location.origin}
      clientID="dc7d8969-82a3-438d-a75e-bbeefe9ef94d"
      onStateChangeCallback={handleOnStateChange}
    >
      <App />
    </AuthorizerProvider>
  ),
  document.getElementById('root')!,
);
