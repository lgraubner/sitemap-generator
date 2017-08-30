const Logger = require('../Logger');

let logger;

beforeEach(() => {
  logger = Logger();
});

test('should be a function', () => {
  expect(Logger).toBeInstanceOf(Function);
});

test('should have property stats', () => {
  expect(logger).toHaveProperty('stats');
  expect(typeof logger.stats).toBe('object');
});

describe('#on', () => {
  test('should have on method', () => {
    expect(logger).toHaveProperty('on');
  });
});

describe('#off', () => {
  test('should have off method', () => {
    expect(logger).toHaveProperty('off');
  });
});

describe('#log', () => {
  test('should have log method', () => {
    expect(logger).toHaveProperty('log');
  });

  test('should trigger listener', () => {
    const listener = jest.fn();
    const payload = {
      foo: 'bar',
    };
    const event = 'test';

    logger.on(event, listener);
    logger.log(event, payload);
    expect(listener).toBeCalledWith(payload);
  });
});
