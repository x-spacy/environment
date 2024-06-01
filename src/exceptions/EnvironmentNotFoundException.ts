import { Exception } from '@x-spacy/exceptions';

export class EnvironmentNotFoundException extends Exception {
  constructor() {
    super(404, 'EnvironmentNotFoundException');
  }
}
