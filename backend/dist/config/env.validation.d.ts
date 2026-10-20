export declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DATABASE_URL: string;
    SHOPIFY_SHOP_DOMAIN: string;
    SHOPIFY_ADMIN_ACCESS_TOKEN: string;
    SHOPIFY_API_VERSION: string;
    SHOPIFY_WEBHOOK_SECRET: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
