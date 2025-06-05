import 'next';

declare module 'next' {
  export interface NextApiRequest {
    session?: any; // Replace 'any' with your session type
  }
}

declare module 'next/server' {
  export interface NextFetchEvent {
    request: Request;
    page: string;
  }
}
