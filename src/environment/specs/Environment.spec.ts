import { Environment } from '@x-spacy/environment/environment/implementations/Environment';

import { EnvironmentNotFoundException } from '@x-spacy/environment/exceptions/EnvironmentNotFoundException';

import { existsSync, readFileSync } from 'node:fs';

jest.mock('node:fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue(
    'NODE_ENV=test' +
    '\n' +
    '# Comment' +
    '\n' +
    'PORT=3333' +
    '\n' +
    'HOST=0.0.0.0:${PORT}'
  )
}));

describe('Environment', () => {
  test('should not be able to read environment file when window is defined', () => {
    Object.defineProperty(global, 'window', {
      value: {},
      configurable: true
    });

    expect.assertions(1);

    try {
      Environment.getString('PORT');
    } catch (e) {
      expect(e).toBeInstanceOf(EnvironmentNotFoundException);
    } finally {
      Object.defineProperty(global, 'window', {
        value: undefined,
        configurable: false
      });
    }
  });

  test('should not prepare environment when file does not exist', () => {
    (existsSync as jest.Mock).mockReturnValueOnce(false);

    Environment['readEnvironmentFile']();

    expect(process.env.TEST_VAR).toBeUndefined();

    (existsSync as jest.Mock).mockReturnValueOnce(true);

    Environment['readEnvironmentFile']();
  });

  test('should skips lines with empty strings, newline characters, and lines starting with #', () => {
    const comments = Object.values(process.env).some(
      it => it?.startsWith('#')
    );

    expect(comments).toBeFalsy();
  });

  test('should handle environment variables with interpolation', () => {
    (readFileSync as jest.Mock).mockReturnValue(
      'HOST=0.0.0.0' +
      '\n' +
      'PORT=3333' +
      '\n' +
      'APP_URL=http://\${HOST}:\${PORT}'
    );

    expect(Environment.getString('HOST')).toBe('0.0.0.0');
    expect(Environment.getString('PORT')).toBe('3333');
    expect(Environment.getString('APP_URL')).toBe('http://0.0.0.0:3333');
  });

  test('should be able to get a valid value', () => {
    expect(Environment.getString('NODE_ENV')).toBeDefined();
  });

  test('should be thrown an exception when the string value is not found', () => {
    expect.assertions(1);

    try {
      Environment.getString('ANY_KEY');
    } catch (e) {
      expect(e).toBeInstanceOf(EnvironmentNotFoundException);
    }
  });

  test('should be able to get a string value', () => {
    expect(Environment.getString('NODE_ENV')).toMatch(/test/);
  });

  test('should be able to get a string value or null', () => {
    expect(Environment.getStringOrNull('ANY_KEY')).toBeNull();
  });

  test('should be able to get a number value', () => {
    expect(Environment.getInt('PORT')).not.toBeNaN();
  });

  test('should thrown an exception when the number value is not found', () => {
    expect.assertions(1);

    try {
      Environment.getInt('ANY_KEY');
    } catch (e) {
      expect(e).toBeInstanceOf(EnvironmentNotFoundException);
    }
  });

  test('should be able to get a number value or null', () => {
    expect(Environment.getIntOrNull('ANY_KEY')).toBeNull();
  });

  test('should be overwrite process.env value', () => {
    expect(process.env['NODE_ENV']).toBe(Environment.getString('NODE_ENV'));
  });

  test('should be able to get a boolean value', () => {
    expect(Environment.isTestEnvironment).toBeTruthy();
  });

  test('should be able to change environment file name', () => {
    Environment.environmentFile = '.env.test';

    expect(Environment.environmentFile).toBe('.env.test');
  });
});
