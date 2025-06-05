// Type declarations for NextAuth.js
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
  }
}

// Type declarations for bcryptjs
declare module 'bcryptjs' {
  function hashSync(data: string | Buffer, saltOrRounds: string | number): string;
  function compareSync(data: string | Buffer, encrypted: string): boolean;
  function genSaltSync(rounds?: number): string;
  
  export {
    hashSync,
    compareSync,
    genSaltSync
  };
}
