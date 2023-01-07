import { ParentComponent } from 'solid-js';
import { createForm } from '@felte/solid';

type Placeholder = {
  email: string;
  password: string;
};
type AuthorizerBasicAuthLoginProps = {
  placeholder: Placeholder;
};
export const AuthorizerBasicAuthLogin = () => {
  const { form } = createForm({
    onSubmit: (values, context) => {
      console.warn('onSubmit values', values);
      console.warn('onSubmit context', context);
    },
    onSuccess(response, context) {
      // Do something with the returned value from `onSubmit`.
      console.warn('onSuccess response', response);
      console.warn('onSuccess context', context);
    },
    onError(err, context) {
      // Do something with the error thrown from `onSubmit`.
      console.warn('onError err', err);
      console.warn('onError context', context);
    },
  });

  return (
    <form use:form>
      <input type="text" name="email" placeholder="email" />
      <input type="password" placeholder="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  );
};
