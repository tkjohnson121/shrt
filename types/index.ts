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

export interface ShrtUrl {
  created_by: string;
  created_on: number;
  url: string;
  shrt_url: string | null;
}
