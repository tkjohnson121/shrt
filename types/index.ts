// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export interface FetchState<T = {}> {
  loading: boolean;
  error?: Error | { [key: string]: any };
  data?: T;
}
