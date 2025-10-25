import { existsSync, readFileSync } from 'node:fs';

import { EnvironmentNotFoundException } from '@x-spacy/environment/exceptions/EnvironmentNotFoundException';

export class Environment {
  private static ENVIRONMENT_FILE = `${process.cwd()}/.env`;

  private static LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;

  private static readEnvironmentFile(): NodeJS.ProcessEnv {
    if (typeof window !== 'undefined') {
      return process.env;
    }

    if (!existsSync(Environment.ENVIRONMENT_FILE)) {
      return process.env;
    }

    const content = readFileSync(Environment.ENVIRONMENT_FILE, 'utf-8').replace(/\r\n?/mg, '\n');

    const lines = new Array<string>();

    let match;

    while ((match = Environment.LINE.exec(content)) !== null) {
      const key = match[1];

      let value = (match[2] ?? '').trim();

      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');

      const maybeQuote = value[0];

      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, '\n');
        value = value.replace(/\\r/g, '\r');
      }

      lines.push(`${key}=${value}`);
    }

    for (const line of lines) {
      if (/(^$|\n|\#)/.test(line)) {
        continue;
      }

      const variable = line.split(/=/);

      const key = variable[0].trim();

      let value = variable[1].trim();

      if (process.env[key] && process.env[key] === value) {
        continue;
      }

      const matcher = value.match(/\$\{(.*?)\}/g);

      if (matcher) {
        for (const match of matcher) {
          const environment = match.split(/\{/)[1].split(/\}/)[0];
          const environmentValue = process.env[environment];

          if (environmentValue) {
            value = value.replace(match, environmentValue);
          }
        }
      }

      process.env[key] = value.replace(/("|\n)/g, '');
    }

    return process.env;
  }

  public static get(key: string): string | null | undefined {
    return Environment.readEnvironmentFile()[key];
  }

  public static getString(key: string): string {
    const value = Environment.getStringOrNull(key);

    if (value == null || value == undefined) {
      throw new EnvironmentNotFoundException(key);
    }

    return String(value);
  }

  public static getStringOrNull(key: string): string | null | undefined {
    const value = Environment.get(key);

    if (value == null || value == undefined) {
      return null;
    }

    return String(value);
  }

  public static getInt(key: string): number {
    const value = Environment.getIntOrNull(key);

    if (value == null || value == undefined) {
      throw new EnvironmentNotFoundException(key);
    }

    return Number(value);
  }

  public static getIntOrNull(key: string): number | null | undefined {
    const value = Environment.get(key);

    if (value == null || value == undefined) {
      return null;
    }

    return Number(value);
  }

  public static get isTestEnvironment() {
    return Environment.getStringOrNull('NODE_ENV') == 'test';
  }

  public static get environmentFile(): string {
    return Environment.ENVIRONMENT_FILE;
  }

  public static set environmentFile(file: string) {
    Environment.ENVIRONMENT_FILE = file;
  }

  public static get workingDirectory(): string {
    return process.cwd();
  }
}
