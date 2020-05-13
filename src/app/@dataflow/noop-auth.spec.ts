import { NoopAuthTimer } from './noop-auth';

describe('Noopauth', () => {
  it('should create an instance', () => {
    expect(new NoopAuthTimer()).toBeTruthy();
  });
});
