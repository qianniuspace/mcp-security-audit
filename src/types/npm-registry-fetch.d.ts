declare module 'npm-registry-fetch' {
    interface FetchOptions {
        method?: string;
        body?: any;
        gzip?: boolean;
        [key: string]: any;
    }

    interface NpmFetch {
        json(url: string, options?: FetchOptions): Promise<any>;
    }

    const npmFetch: NpmFetch;
    export default npmFetch;
} 