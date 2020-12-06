import firebase from 'firebase';
// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export interface FetchState<T = {}> {
  loading: boolean;
  error?: Error | { [key: string]: any } | null;
  data?: T;
}

export type ShrtUser =
  | {
      token?: string | Promise<string>;
      email: string | null;
      emailVerified: boolean;
      displayName: string | null;
      uid: string;
      photoURL: string | null;
    }
  | firebase.User;

export interface UserDocument {
  /** Admin Data */
  uid?: string;
  created_on: number;
  created_by: string;
  updated_on: number;
  updated_by: string;

  /** User Profile */
  username: string;
  display_name: string;
  title: string;
  company: string;
  bio: string;
  date_of_birth: string;

  /** User Contact */
  email: string;
  phone: string;

  /** User Location */
  state: string;
  city: string;
  street: string;

  /** Social Media */
  twitter: string;
  twitch: string;
  youtube: string;
  instagram: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ShrtDocument {
  shrt_id: string;
  created_by: string;
  created_on: number;
  isArchived: boolean;
  url: string;
  shrt_url: string | null;
  title?: string;
  clicks?: number;
}

export interface LinkConfig {
  link_id: string;
  url: string;
  name: string;
  description: string;
  order: 'default' | number;
}

export interface PLPLinkDocument extends LinkConfig {
  created_by: string;
  created_on: number;
  isArchived: boolean;
}

export interface UsernameDocument {
  created_by: string;
  created_on: number;
}

export interface FileUpload {
  name: string;
  timeCreated: string;
  size: number;
  contentDisposition: string;
  metageneration: string;
  fullPath: string;
  updated: string;
  md5Hash: string;
  contentEncoding: string;
  type: string;
  generation: string;
  contentType: string;
  bucket: string;
}

export type MotionTypes =
  | 'symbol'
  | 'clipPath'
  | 'filter'
  | 'mask'
  | 'marker'
  | 'image'
  | 'text'
  | 'circle'
  | 'svg'
  | 'animate'
  | 'defs'
  | 'desc'
  | 'ellipse'
  | 'feBlend'
  | 'feColorMatrix'
  | 'feComponentTransfer'
  | 'feComposite'
  | 'feConvolveMatrix'
  | 'feDiffuseLighting'
  | 'feDisplacementMap'
  | 'feDistantLight'
  | 'feDropShadow'
  | 'feFlood'
  | 'feFuncA'
  | 'feFuncB'
  | 'feFuncG'
  | 'feFuncR'
  | 'feGaussianBlur'
  | 'feImage'
  | 'feMerge'
  | 'feMergeNode'
  | 'feMorphology'
  | 'feOffset'
  | 'fePointLight'
  | 'feSpecularLighting'
  | 'feSpotLight'
  | 'feTile'
  | 'feTurbulence'
  | 'foreignObject'
  | 'g'
  | 'line'
  | 'linearGradient'
  | 'metadata'
  | 'path'
  | 'pattern'
  | 'polygon'
  | 'polyline'
  | 'radialGradient'
  | 'rect'
  | 'stop'
  | 'switch'
  | 'textPath'
  | 'tspan'
  | 'use'
  | 'view'
  | 'object'
  | 'style'
  | 'progress'
  | 'ruby'
  | 'table'
  | 'small'
  | 'sub'
  | 'embed'
  | 'pre'
  | 'caption'
  | 'menu'
  | 'button'
  | 'menuitem'
  | 'meter'
  | 'textarea'
  | 'time'
  | 'link'
  | 'dialog'
  | 'a'
  | 'abbr'
  | 'address'
  | 'area'
  | 'article'
  | 'aside'
  | 'audio'
  | 'b'
  | 'base'
  | 'bdi'
  | 'bdo'
  | 'big'
  | 'blockquote'
  | 'body'
  | 'br'
  | 'canvas'
  | 'cite'
  | 'code'
  | 'col'
  | 'colgroup'
  | 'data'
  | 'datalist'
  | 'dd'
  | 'del'
  | 'details'
  | 'dfn'
  | 'div'
  | 'dl'
  | 'dt'
  | 'em'
  | 'fieldset'
  | 'figcaption'
  | 'figure'
  | 'footer'
  | 'form'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'head'
  | 'header'
  | 'hgroup'
  | 'hr'
  | 'html'
  | 'i'
  | 'iframe'
  | 'img'
  | 'input'
  | 'ins'
  | 'kbd'
  | 'keygen'
  | 'label'
  | 'legend'
  | 'li'
  | 'main'
  | 'map'
  | 'mark'
  | 'meta'
  | 'nav'
  | 'noscript'
  | 'ol'
  | 'optgroup'
  | 'option'
  | 'output'
  | 'p'
  | 'param'
  | 'picture'
  | 'q'
  | 'rp'
  | 'rt'
  | 's'
  | 'samp'
  | 'script'
  | 'section'
  | 'select'
  | 'source'
  | 'span'
  | 'strong'
  | 'summary'
  | 'sup'
  | 'tbody'
  | 'td'
  | 'tfoot'
  | 'th'
  | 'thead'
  | 'title'
  | 'tr'
  | 'track'
  | 'u'
  | 'ul'
  | 'var'
  | 'video'
  | 'wbr'
  | 'webview';
