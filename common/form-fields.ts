import {
  FaDev,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaSoundcloud,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { FormFields } from './form';

export const smItems = [
  { key: 'twitter', href: 'https://twitter.com/', Icon: FaTwitter },
  { key: 'twitch', href: 'https://twitch.tv/', Icon: FaTwitch },
  { key: 'youtube', href: 'https://youtube.com/channel/', Icon: FaYoutube },
  {
    key: 'instagram',
    href: 'https://instagram.com/',
    Icon: FaInstagram,
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/in/',
    Icon: FaLinkedin,
  },
  { key: 'github', href: 'https://github.com/', Icon: FaGithub },
  { key: 'gitlab', href: 'https://gitlab.com/', Icon: FaGitlab },
  { key: 'DEV', href: 'https://dev.to/', Icon: FaDev },
  {
    key: 'pinterest',
    href: (username?: string | number) =>
      'https://pinterest.com/' + username + '/_created',
    Icon: FaPinterest,
  },
  { key: 'soundcloud', href: 'https://soundcloud.com/', Icon: FaSoundcloud },
];

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

export const formFields: { [key: string]: FormFields } = {
  authFields: {
    email: {
      label: 'Email',
      type: 'email',
      width: 'small',
      placeholder: "What's your email?",
      config: {
        pattern: {
          value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
          message: "Hmm, that doesn't look like an email.",
        },
      },
    },
    password: {
      label: 'Password',
      type: 'password',
      width: 'small',
      placeholder: "What's your password?",
      config: {
        minLength: {
          value: 6,
          message: 'Too short (min 6).',
        },
        maxLength: {
          value: 24,
          message: 'Too long (min 24).',
        },
      },
    },
  },

  plpLinkFields: {
    name: {
      label: 'Name',
      type: 'text',
      width: 'small',
      placeholder: "What's this called?",
      config: {
        required: 'Name is required',
        minLength: {
          value: 2,
          message: 'Too short (min 2).',
        },
        maxLength: {
          value: 48,
          message: 'Too long (min 244).',
        },
      },
    },

    url: {
      label: 'URL',
      type: 'url',
      width: 'small',
      placeholder: 'Where does this go?',
      config: {
        minLength: {
          value: 2,
          message: 'Too short (min 2).',
        },
        maxLength: {
          value: 244,
          message: 'Too long (min 244).',
        },
        pattern: {
          value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          message:
            'URL is incorrect. Tip. Be sure to include "http" or "https"',
        },
      },
    },

    description: {
      label: 'Description',
      type: 'text',
      width: 'medium',
      placeholder: 'Do you want to describe this place?',
      config: {
        minLength: {
          value: 2,
          message: 'Too short (min 2).',
        },
        maxLength: {
          value: 244,
          message: 'Too long (min 244).',
        },
      },
    },
  },

  shrtFields: {
    id: {
      label: 'ID',
      type: 'text',
      width: 'small',
      placeholder: "What's this shrt called?",
      config: {
        maxLength: {
          value: 64,
          message: 'Too long: (max: 64)',
        },
      },
    },
    url: {
      label: 'URL',
      type: 'url',
      width: 'medium',
      placeholder: 'https://this.is.long.com/that?that=we&need=shrtened',
      config: {
        minLength: {
          value: 2,
          message: 'Too short (min 2).',
        },
        maxLength: {
          value: 244,
          message: 'Too long (min 244).',
        },
        pattern: {
          value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          message:
            'URL is incorrect. Tip. Be sure to include "http" or "https"',
        },
      },
    },
  },

  mediaFormFields: {
    avatar: {
      label: 'Avatar',
      type: 'file',
      width: 'circle',
      config: {
        accept: 'png, jpg',
        multiple: false,
      },
    },
    background: {
      label: 'Background',
      type: 'file',
      config: {
        accept: 'png, jpg',
        multiple: false,
      },
      width: 'image',
    },
  },

  profileFields: {
    username: {
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      config: {
        required: 'Username is required',
        pattern: {
          value: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,
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
      width: 'large',
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
      width: 'small',
    },
    company: {
      label: 'Company',
      type: 'text',
      placeholder: 'Where do you work?',
      config: {
        maxLength: {
          value: 32,
          message: 'Company is too long (max: 32).',
        },
      },
      width: 'small',
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
  },

  profileContFields: {
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
        pattern: {
          value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          message: "Hmm, that doesn't look quite right.",
        },
      },
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
      width: 'full',
    },

    city: {
      label: 'City',
      type: 'text',
      placeholder: 'What city?',
      config: {
        minLength: {
          value: 2,
          message: 'City is too short (max: 2).',
        },
        maxLength: {
          value: 244,
          message: 'City is too long (max: 244).',
        },
      },
      width: 'small',
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
      width: 'small',
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
  },

  socialMediaFields: {
    ...Object.fromEntries(
      smItems.map((item) => [
        item.key,
        {
          ...baseSMF,
          label: item.key,
          placeholder: `Enter your ${item.key} @`,
          smLink: item.href,
          Icon: item.Icon,
        },
      ]),
    ),
  },
};
