import { useAuth } from 'features/authentication';
import { ShrtService } from 'features/shrt';
import { ShrtSwal } from 'features/swal';
import React from 'react';
import Form, { OnFormSubmit } from './form';

const shrtFields = {
  url: {
    type: 'url',
    width: 'full',
    placeholder: 'Enter a url to SHRT',
    config: {
      pattern: {
        value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        message: 'URL is incorrect. Tip. Be sure to include "http" or "https"',
      },
    },
  },
};

export function ShrtForm() {
  const authState = useAuth();

  const onShrtSubmit: OnFormSubmit = async ({ url }, setStatus) => {
    try {
      setStatus('adding shrt');

      if (!authState.data?.currentUser) {
        throw new Error('Please login to Shrten a link');
      }

      await ShrtService.addShrt(authState.data.currentUser, url);

      setStatus('Update Complete!');
      ShrtSwal.fire({ type: 'success' });
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  return (
    <Form
      key="shrt"
      onFormSubmit={onShrtSubmit}
      fields={shrtFields}
      buttonText="ShrtenURL"
    />
  );
}
