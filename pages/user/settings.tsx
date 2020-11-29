import { AuthForm, ErrorWrapper, Form, Loading, OnFormSubmit } from 'common';
import { AuthService, useAuth } from 'features/authentication';
import { FirebaseClient } from 'features/firebase-client';
import { ShrtSwal } from 'features/swal';
import { UserService } from 'features/user';
import React, { useState } from 'react';
import { FetchState } from 'types';

const mediaFormFields = {
  avatar: {
    label: 'Avatar',
    type: 'file',
    width: 'circle',
    config: {
      accept: 'png, jpg',
      multiple: false,
    },
  },
  header: {
    label: 'Background',
    type: 'file',
    config: {
      accept: 'png, jpg',
      multiple: false,
    },
    width: 'image',
  },
};

const profileFields = {
  email: {
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
    config: {
      required: 'Username is required',
      pattern: {
        value: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        message: "Hmm, that doesn't seem quite right.",
      },
      maxLength: {
        value: 64,
        message: 'Name is too long (max: 64).',
      },
      minLength: {
        value: 2,
        message: 'Name is too short (min: 2).',
      },
    },
    width: 'small',
  },
  display_name: {
    label: 'Name',
    type: 'text',
    placeholder: "What's your name?",
    config: {
      required: 'Name is required',
      maxLength: {
        value: 64,
        message: 'Name is too long (max: 64).',
      },
      minLength: {
        value: 2,
        message: 'Name is too short (min: 2).',
      },
    },
    width: 'medium',
  },
  title: {
    label: 'Title',
    type: 'text',
    placeholder: 'What do you do?',
    config: {
      maxLength: {
        value: 32,
        message: 'Title is too long (max: 32).',
      },
    },
    width: 'medium',
  },
  bio: {
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    config: {
      maxLength: {
        value: 320,
        message: 'Bio is too long (max: 320).',
      },
    },
    width: 'full',
  },
};

const profileContFields = {
  date_of_birth: {
    label: 'Birthday',
    type: 'date',
    width: 'small',
  },
  phone: {
    label: 'Phone',
    type: 'tel',
    placeholder: "What's your phone number?",
    config: {
      required: 'Name is required',
      pattern: {
        value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        message: "Hmm, that doesn't look quite right.",
      },
    },
    width: 'medium',
  },
  state: {
    label: 'State',
    type: 'select',
    placeholder: 'What state doe you live in?',
    options: [
      'AK - Alaska',
      'AL - Alabama',
      'AR - Arkansas',
      'AS - American Samoa',
      'AZ - Arizona',
      'CA - California',
      'CO - Colorado',
      'CT - Connecticut',
      'DC - District of Columbia',
      'DE - Delaware',
      'FL - Florida',
      'GA - Georgia',
      'GU - Guam',
      'HI - Hawaii',
      'IA - Iowa',
      'ID - Idaho',
      'IL - Illinois',
      'IN - Indiana',
      'KS - Kansas',
      'KY - Kentucky',
      'LA - Louisiana',
      'MA - Massachusetts',
      'MD - Maryland',
      'ME - Maine',
      'MI - Michigan',
      'MN - Minnesota',
      'MO - Missouri',
      'MS - Mississippi',
      'MT - Montana',
      'NC - North Carolina',
      'ND - North Dakota',
      'NE - Nebraska',
      'NH - New Hampshire',
      'NJ - New Jersey',
      'NM - New Mexico',
      'NV - Nevada',
      'NY - New York',
      'OH - Ohio',
      'OK - Oklahoma',
      'OR - Oregon',
      'PA - Pennsylvania',
      'PR - Puerto Rico',
      'RI - Rhode Island',
      'SC - South Carolina',
      'SD - South Dakota',
      'TN - Tennessee',
      'TX - Texas',
      'UT - Utah',
      'VA - Virginia',
      'VI - Virgin Islands',
      'VT - Vermont',
      'WA - Washington',
      'WI - Wisconsin',
      'WV - West Virginia',
      'WY - Wyoming',
    ],
    width: 'medium',
  },
  street: {
    label: 'Street Address',
    type: 'text',
    placeholder: 'Where do you live?',
    config: {
      maxLength: {
        value: 320,
        message: 'Address is too long (max: 320).',
      },
    },
    width: 'medium',
  },
  zip: {
    label: 'ZIP',
    type: 'number',
    placeholder: 'Where do you live?',
    config: {
      pattern: {
        value: /^\d{5}(?:[-\s]\d{4})?$/,
        message: "Hmm, that doesn't seem quite right.",
      },
    },
    width: 'small',
  },
};

const baseSMF = {
  type: 'text',
  config: {
    maxLength: {
      value: 64,
      message: 'Too long (max: 64).',
    },
    minLength: {
      value: 2,
      message: 'Too short (min: 2).',
    },
  },
  width: 'small',
};

const socialMediaFields = {
  twitter: {
    ...baseSMF,
    label: 'Twitter',
    placeholder: 'Enter your Twitter @',
  },
  twitch: {
    ...baseSMF,
    label: 'Twitch',
    placeholder: 'Enter your Twitch @',
  },
  youtube: {
    ...baseSMF,
    label: 'YouTube',
    placeholder: 'Enter your YouTube @',
  },
  instagram: {
    ...baseSMF,
    label: 'Instagram',
    placeholder: 'Enter your Instagram @',
  },
  linkedin: {
    ...baseSMF,
    label: 'LinkedIn',
    placeholder: 'Enter your LinkedIn @',
  },
  github: {
    ...baseSMF,
    label: 'Github',
    placeholder: 'Enter your Github @',
  },
  website: {
    ...baseSMF,
    label: 'Website / Portfolio',
    placeholder: 'Enter your Website / Portfolio URL',
    type: 'url',
  },
};

export default function UserSettings() {
  const authState = useAuth();

  // open user document listener
  // controlled component
  // isEditing / isNotEditing

  const [state, setState] = useState<FetchState>({ loading: false });

  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));

  const onLogout = async () => {
    try {
      setState({ loading: true });
      await AuthService.signOut();
      setState({ loading: false });
    } catch (error) {
      onError(error);
    }
  };

  const onFormSubmit: OnFormSubmit = async ({ ...args }, setStatus) => {
    try {
      setStatus('updating');

      if (!authState.data?.currentUser) {
        throw new Error('Please Login');
      }

      await UserService.updateUserDocument(authState.data?.currentUser, {
        ...args,
      });

      console.log({ ...args });

      setStatus('Update Complete!');
      ShrtSwal.fire({ type: 'success' });
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  const onMediaSubmit: OnFormSubmit = async ({ avatar, header }, setStatus) => {
    try {
      setStatus('updating media');

      if (!authState.data?.currentUser) {
        throw new Error('Please Login.');
      }

      if (!!avatar[0]) {
        setStatus('updating avatar...');

        await UserService.uploadUserFile(
          authState.data?.currentUser,
          avatar[0],
          { name: 'avatar' },
        );
      }

      if (!!header[0]) {
        setStatus('updating header...');

        await UserService.uploadUserFile(
          authState.data?.currentUser,
          avatar[0],
          { name: 'avatar' },
        );
      }

      setStatus('Update Complete!');
      ShrtSwal.fire({ type: 'success' });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      console.error(error);
      setStatus(error.message);
    }
  };

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorWrapper error={state.error} />;

  return authState.data?.isAuthenticated ? (
    <section css={{ maxWidth: '50rem' }}>
      <h1 className="display">User Settings</h1>
      <button onClick={onLogout}>Logout</button>

      <Form
        title={'Media'}
        key="media"
        onFormSubmit={onMediaSubmit}
        fields={mediaFormFields}
        buttonText="Save"
      />

      <Form
        title={'User Profile'}
        subtitle={
          'Edit these setting to tell your audience more about who you are.'
        }
        key="profile"
        onFormSubmit={onFormSubmit}
        fields={profileFields}
        buttonText="Save"
      />

      <Form
        title={'User Profile Cont.'}
        subtitle={'More miscelleaneous setting to display on your PLP'}
        key="profile-cont"
        onFormSubmit={onFormSubmit}
        fields={profileContFields}
        buttonText="Save"
      />

      <Form
        title={'Social Media'}
        key="social-media"
        onFormSubmit={onFormSubmit}
        fields={socialMediaFields}
        buttonText="Save"
      />
    </section>
  ) : (
    <AuthForm />
  );
}
