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

export interface ShrtUserDocument {
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

export interface ShrtUrl {
  created_by: string;
  created_on: number;
  deleted: boolean;
  url: string;
  shrt_url: string | null;
}
