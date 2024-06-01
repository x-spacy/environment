declare module '@x-spacy/environment' {
  export class Environment {
    /**
     * Get a string value from environment variables.
     *
     * @param key string
     * @returns {string}
     */
    public static getString(key: string): string

    /**
     * Get a string value from environment variables or null.
     *
     * @param key string
     * @returns {string | null}
     */
    public static getStringOrNull(key: string): string | null

    /**
     * Get a number value from environment variables.
     *
     * @param key string
     * @returns {number}
     */
    public static getInt(key: string): number

    /**
     * Get a number value from environment variables or null.
     *
     * @param key string
     * @returns {number | null}
     */
    public static getIntOrNull(key: string): number | null

    /**
     * Get a boolean value indicating if the environment is a test environment.
     *
     * @returns {boolean}
     */
    public static get isTestEnvironment(): boolean

    /**
     * Change the path containing the environment file to be read.
     * 
     * @param file string
     */
    public static set environmentFile(file: string): void
  }
}
