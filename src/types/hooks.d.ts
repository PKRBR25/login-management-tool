// useAuth hook
declare module '@/hooks/use-auth' {
  interface UseAuthOptions {
    required?: boolean;
    redirectTo?: string;
    redirectIfFound?: boolean;
  }

  interface UseAuthResult {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: any;
    session: any;
  }

  function useAuth(options?: UseAuthOptions): UseAuthResult;
  export { useAuth };
}

// Utils
declare module '@/lib/utils' {
  function cn(...inputs: any[]): string;
  function formatDate(input: string | number | Date): string;
  function formatDateTime(date: Date | string): string;
  function getBaseUrl(): string;
  function formatCurrency(amount: number): string;
  function truncate(str: string, length: number): string;
  function isArrayOfFile(files: unknown): files is File[];
  function formatBytes(
    bytes: number,
    decimals?: number,
    sizeType?: 'accurate' | 'normal'
  ): string;
  function formatId(id: string): string;
  function slugify(str: string): string;
  function unslugify(str: string): string;
  function toTitleCase(str: string): string;
  function toSentenceCase(str: string): string;
  function isMacOs(): boolean;
  function formatDateToNow(date: Date): string;
  
  export {
    cn,
    formatDate,
    formatDateTime,
    getBaseUrl,
    formatCurrency,
    truncate,
    isArrayOfFile,
    formatBytes,
    formatId,
    slugify,
    unslugify,
    toTitleCase,
    toSentenceCase,
    isMacOs,
    formatDateToNow
  };
}
