import { ShrtService } from 'features/shrt';
import React from 'react';
import Form, { OnFormSubmit } from './form';
import { formFields } from './form-fields';

export function ShrtForm({ withId }: { withId?: boolean }) {
  const onShrtSubmit: OnFormSubmit = async ({ url, id }, setStatus) => {
    try {
      setStatus({ message: 'adding shrt', type: 'info' });

      const { shrt_url, shrt_id } = await ShrtService.addShrt(url, id);

      // copy to clipboard
      // https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
      navigator?.clipboard.writeText(shrt_url);
      setStatus({
        type: 'success',
        message: (
          <p>
            Shrt Copied:{' '}
            <a href={shrt_url} target="_new">
              {shrt_id}
            </a>
          </p>
        ),
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.includes('permission-denied')
        ? 'Hmm, that shrt might already be taken.'
        : error.message;

      setStatus({ message: errorMessage, type: 'error' });
    }
  };

  const shrtFormfields = withId
    ? formFields.shrtFields
    : { url: { ...formFields.shrtFields.url, label: undefined } };

  return (
    <Form
      key="shrt"
      onFormSubmit={onShrtSubmit}
      fields={shrtFormfields}
      buttonText="ShrtenURL"
    />
  );
}
