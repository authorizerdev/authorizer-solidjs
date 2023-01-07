import { Component, createEffect } from 'solid-js';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { z } from 'zod';

type EmailMessage = {
  required: string;
  validationFailure: string;
};

type AuthorizerMagicLinkLoginProps = {
  placeholder: string;
  buttonText: string;
  messages: EmailMessage;
};
export const AuthorizerMagicLinkLogin: Component<AuthorizerMagicLinkLoginProps> = (props) => {
  const formSchema = z.object({
    email: z.string().email({ message: props.messages.validationFailure }).min(1, { message: props.messages.required }),
  });
  const { form, errors, touched } = createForm<z.infer<typeof formSchema>>({
    extend: validator({ schema: formSchema }),
    onSubmit: (values, context) => {
      console.warn('onSubmit values', values);
      console.warn('onSubmit context', context);
      return { success: 'youpiiii' };
    },
    onSuccess(response, context) {
      // Do something with the returned value from `onSubmit`.
      console.warn('onSuccess response', response);
      console.warn('onSuccess context', context);
      context.reset();
    },
    onError(err, context) {
      // Do something with the error thrown from `onSubmit`.
      console.warn('onError err', err);
      console.warn('onError context', context);
    },
  });

  createEffect(() => {
    console.log('errors', JSON.stringify(props.messages.required, null, 2));
  });

  return (
    <>
      <form use:form>
        <input type="text" name="email" placeholder={props.placeholder} />
        <button type="submit">{props.buttonText}</button>
      </form>
      <pre>{JSON.stringify(errors(), null, 2)}</pre>
    </>
  );
};
