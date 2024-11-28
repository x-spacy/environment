import { Exception } from '@x-spacy/exceptions';

export class EnvironmentNotFoundException extends Exception {
  constructor(name: string) {
    super(404, 'EnvironmentNotFoundException', undefined, `environment ${name} was not found.`);
  }
}
