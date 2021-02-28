const { EventEmitter } = require("events");

const eventEmitter = new EventEmitter();

const mockConstructor = jest.fn();
let mockRdKafkaConsumer = {};

jest.mock("node-rdkafka", () => ({
  KafkaConsumer: class {
    constructor(...args) {
      mockConstructor(...args);
      return mockRdKafkaConsumer;
    }
  },
}));

const { Consumer } = require("./consumer");

let consumer;
let actualError;

beforeEach(() => {
  mockRdKafkaConsumer = {
    on: eventEmitter.on.bind(eventEmitter),
    once: eventEmitter.once.bind(eventEmitter),
    subscribe: jest.fn(),
    connect: jest.fn(),
    consume: jest.fn((num, callback) => {
      // eslint-disable-next-line no-unused-expressions
      callback && callback(null, []);
    }),
    commitMessage: jest.fn(),
  };
  mockRdKafkaConsumer.subscribe.mockClear();
  mockRdKafkaConsumer.connect.mockClear();
  mockRdKafkaConsumer.consume.mockClear();
  mockRdKafkaConsumer.commitMessage.mockClear();

  consumer = undefined;
  actualError = undefined;
});

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

describe("Test validate options", () => {
  test("Option 'name' is required", () => {
    try {
      consumer = new Consumer();
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'name' is required");
  });

  test("Option 'name' is required", () => {
    try {
      consumer = new Consumer({});
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'name' is required");
  });

  test("Option 'host' is required", () => {
    try {
      consumer = new Consumer({ name: "a" });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'host' is required");
  });

  test("Option 'groupId' is required", () => {
    try {
      consumer = new Consumer({ name: "name", host: "host" });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'groupId' is required");
  });

  test("Option 'topic' is required", () => {
    try {
      consumer = new Consumer({ name: "name", host: "host", groupId: "groupId" });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'topic' is required");
  });

  test("Option 'topic' is required", () => {
    try {
      consumer = new Consumer({ name: "name", host: "host", groupId: "groupId" });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'topic' is required");
  });

  test("Create new consumer success with required options", () => {
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
    });

    expect(consumer.options).toEqual({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      mode: "non-flowing",
      connectTimeout: 5000,
      numMsgFetchPerTime: 1,
      intervalFetchMessage: 10,
      rdKafkaConfig: undefined,
      rdKafkaTopicConfig: undefined,
    });
    expect(mockConstructor).toBeCalledWith(
      {
        "group.id": "groupId",
        "metadata.broker.list": "host",
        "enable.auto.commit": false,
        "socket.keepalive.enable": true,
        event_cb: true,
      },
      {
        "auto.offset.reset": "earliest",
      },
    );
  });

  test("Option 'mode' should be set 'flowing' or 'non-flowing'", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        mode: "abc",
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'mode' should be set 'flowing' or 'non-flowing'");
  });

  test("Option 'connectTimeout' should be integer", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        connectTimeout: "connectTimeout",
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'connectTimeout' should be integer");
  });

  test("Option 'connectTimeout' should greater than 0", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        connectTimeout: -1,
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'connectTimeout' should greater than 0");
  });

  test("Option 'intervalFetchMessage' should be integer", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        intervalFetchMessage: "string",
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'intervalFetchMessage' should be integer");
  });

  test("Option 'intervalFetchMessage' should greater than 0", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        intervalFetchMessage: -1,
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'intervalFetchMessage' should greater than 0");
  });

  test("Option 'numMsgFetchPerTime' should be integer", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        numMsgFetchPerTime: "string",
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'numMsgFetchPerTime' should be integer");
  });

  test("Option 'numMsgFetchPerTime' should greater than 0", () => {
    try {
      consumer = new Consumer({
        name: "name",
        host: "host",
        groupId: "groupId",
        topic: "topic",
        numMsgFetchPerTime: -1,
      });
    } catch (error) {
      actualError = error;
    }

    expect(consumer).toBe(undefined);
    expect(actualError.message).toEqual("Error: Option 'numMsgFetchPerTime' should greater than 0");
  });
});

test("Test support config to node-rdkafka", () => {
  consumer = new Consumer({
    name: "name",
    host: "host",
    groupId: "groupId",
    topic: "topic",
    rdKafkaConfig: {
      "group.id": "1",
      "metadata.broker.list": "2",
      "enable.auto.commit": true,
      "socket.keepalive.enable": false,
      event_cb: false,
      debug: "all",
    },
    rdKafkaTopicConfig: {
      "auto.offset.reset": "latest",
      config: "config",
    },
  });

  expect(consumer).toBeDefined();
  expect(mockConstructor).toBeCalledWith(
    {
      "group.id": "1",
      "metadata.broker.list": "2",
      "enable.auto.commit": true,
      "socket.keepalive.enable": false,
      event_cb: false,
      debug: "all",
    },
    {
      "auto.offset.reset": "latest",
      config: "config",
    },
  );
});

test("Test listen event from node-rdkafka", () => {
  consumer = new Consumer({
    name: "name",
    host: "host",
    groupId: "groupId",
    topic: "topic",
  });

  const mockEventHandler = jest.fn();
  consumer.on("mockEvent", mockEventHandler);
  eventEmitter.emit("mockEvent", "param");
  expect(mockEventHandler).toBeCalledWith("param");
});

test("Test handle and throw error on connection timeout", () => {
  const mockError = new Error("Mock error");
  mockRdKafkaConsumer.connect.mockImplementationOnce((options, callback) => {
    callback(mockError);
  });

  consumer = new Consumer({
    name: "name",
    host: "host",
    groupId: "groupId",
    topic: "topic",
  });

  try {
    consumer.listen(() => {});
  } catch (error) {
    actualError = error;
  }

  expect(actualError.message).toBe(`Cannot connect to Kafka.\n${mockError.stack}`);
});

test("Should throw error if broker transport failure", () => {
  consumer = new Consumer({
    name: "name",
    host: "host",
    groupId: "groupId",
    topic: "topic",
  });

  consumer.listen(() => {});
  try {
    eventEmitter.emit("event.error", new Error("Local: Broker transport failure"));
  } catch (error) {
    actualError = error;
  }

  expect(actualError.message).toBe("Local: Broker transport failure");
});

test("Should log warning if event.error is not broker transport failure", () => {
  const mockOptions = {
    name: "name",
    host: "host",
    groupId: "groupId",
    topic: "topic",
    logger: { debug: jest.fn(), warn: jest.fn() },
  };
  consumer = new Consumer(mockOptions);

  consumer.listen(() => {});
  const mockError = new Error("Local: Other error");
  eventEmitter.emit("event.error", mockError);

  expect(mockOptions.logger.warn).toBeCalledWith(mockError);
});

describe("Test non-flowing mode", () => {
  test("Consume message success and pass messages to handler", async () => {
    const mockMessage = { offset: 1 };
    mockRdKafkaConsumer.consume
      .mockImplementationOnce((num, cb) => {
        cb(null, [mockMessage, mockMessage]);
      })
      .mockImplementationOnce((num, cb) => {
        cb(null, [mockMessage, mockMessage]);
      });

    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      intervalFetchMessage: 500,
    });

    const mockTrackHandler = jest.fn();
    consumer.listen(mockTrackHandler);
    eventEmitter.emit("ready");

    await sleep(800);

    expect(mockRdKafkaConsumer.consume).toBeCalledTimes(2);
    expect(mockRdKafkaConsumer.subscribe).toBeCalledWith(["topic"]);
    expect(mockTrackHandler).toBeCalledTimes(4);
    expect(mockRdKafkaConsumer.commitMessage).toBeCalledTimes(4);
    expect(mockTrackHandler).toBeCalledWith(mockMessage);
  });

  test("Consume message with error should log error and not break the app", async () => {
    const mockError = new Error("abc");
    mockRdKafkaConsumer.consume
      .mockImplementationOnce((num, cb) => {
        cb(mockError, null);
      })
      .mockImplementationOnce((num, cb) => {
        cb(mockError, null);
      });

    const mockLogger = { warn: jest.fn(), debug: jest.fn(), error: jest.fn() };
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      intervalFetchMessage: 500,
      logger: mockLogger,
    });

    const mockTrackHandler = jest.fn();
    consumer.listen(mockTrackHandler);
    eventEmitter.emit("ready");

    await sleep(800);

    expect(mockRdKafkaConsumer.consume).toBeCalledTimes(2);
    expect(mockRdKafkaConsumer.subscribe).toBeCalledWith(["topic"]);
    expect(mockLogger.error).toBeCalledTimes(2);
    expect(mockLogger.error).toBeCalledWith(mockError);
    expect(mockTrackHandler).not.toBeCalled();
    expect(mockRdKafkaConsumer.commitMessage).not.toBeCalled();
  });

  test("Messages is not array should bypass and not break the app", async () => {
    mockRdKafkaConsumer.consume
      .mockImplementationOnce((num, cb) => {
        cb(null, null);
      })
      .mockImplementationOnce((num, cb) => {
        cb(null, undefined);
      })
      .mockImplementationOnce((num, cb) => {
        cb(null, "string");
      })
      .mockImplementationOnce((num, cb) => {
        cb(null, 123);
      })
      // this mock for test not call handler if no messages consumed
      .mockImplementationOnce((num, cb) => {
        cb(null, []);
      })
      // this mock for testing the consumer is still working
      .mockImplementationOnce((num, cb) => {
        cb(null, ["valid-array-message"]);
      });

    const mockLogger = { warn: jest.fn(), debug: jest.fn(), error: jest.fn() };
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      intervalFetchMessage: 100,
      logger: mockLogger,
    });

    const mockTrackHandler = jest.fn();
    consumer.listen(mockTrackHandler);
    eventEmitter.emit("ready");

    await sleep(600);

    expect(mockRdKafkaConsumer.consume).toBeCalledTimes(6);
    expect(mockRdKafkaConsumer.subscribe).toBeCalledWith(["topic"]);
    expect(mockLogger.error).not.toBeCalled();
    expect(mockTrackHandler).toBeCalledTimes(1);
    expect(mockTrackHandler).toBeCalledWith("valid-array-message");
    expect(mockRdKafkaConsumer.commitMessage).toBeCalledTimes(1);
  });
});

describe("Test flowing mode", () => {
  test("Should subscribe on topic and start consume", () => {
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      mode: "flowing",
    });

    consumer.listen(() => {});
    eventEmitter.emit("ready");

    expect(mockRdKafkaConsumer.subscribe).toBeCalledWith(["topic"]);
    expect(mockRdKafkaConsumer.consume).toBeCalledWith();
  });

  test("Test consume message", () => {
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      mode: "flowing",
    });

    const mockHandler = jest.fn();
    consumer.listen(mockHandler);
    eventEmitter.emit("ready");
    eventEmitter.emit("data", { partition: 1 });

    expect(mockHandler).toBeCalledWith({ partition: 1 });
  });

  test("Commit message in order", () => {
    consumer = new Consumer({
      name: "name",
      host: "host",
      groupId: "groupId",
      topic: "topic",
      mode: "flowing",
    });

    consumer.flowingCommitQueue = {
      0: [
        { message: { offset: 1, partition: 0 }, done: false },
        { message: { offset: 2, partition: 0 }, done: false },
        { message: { offset: 3, partition: 0 }, done: false },
        { message: { offset: 4, partition: 0 }, done: false },
      ],
      1: [
        { message: { offset: 6, partition: 1 }, done: false },
        { message: { offset: 7, partition: 1 }, done: false },
        { message: { offset: 8, partition: 1 }, done: false },
        { message: { offset: 9, partition: 1 }, done: false },
      ],
    };

    consumer.flowingCommit({ offset: 2, partition: 0 });
    consumer.flowingCommit({ offset: 3, partition: 0 });
    consumer.flowingCommit({ offset: 7, partition: 1 });
    consumer.flowingCommit({ offset: 8, partition: 1 });

    expect(consumer.flowingCommitQueue[0].length).toBe(4);
    expect(consumer.flowingCommitQueue[1].length).toBe(4);
    expect(consumer.flowingCommitQueue[0][0]).toEqual({
      message: { offset: 1, partition: 0 },
      done: false,
    });
    expect(consumer.flowingCommitQueue[1][0]).toEqual({
      message: { offset: 6, partition: 1 },
      done: false,
    });

    consumer.flowingCommit({ offset: 6, partition: 1 });
    expect(consumer.flowingCommitQueue[0].length).toBe(4);
    expect(consumer.flowingCommitQueue[1].length).toBe(1);
    expect(consumer.flowingCommitQueue[0][0]).toEqual({
      message: { offset: 1, partition: 0 },
      done: false,
    });
    expect(consumer.flowingCommitQueue[1][0]).toEqual({
      message: { offset: 9, partition: 1 },
      done: false,
    });
    consumer.flowingCommit({ offset: 1, partition: 0 });
    expect(consumer.flowingCommitQueue[0].length).toBe(1);
    expect(consumer.flowingCommitQueue[1].length).toBe(1);
    expect(consumer.flowingCommitQueue[0][0]).toEqual({
      message: { offset: 4, partition: 0 },
      done: false,
    });
    expect(consumer.flowingCommitQueue[1][0]).toEqual({
      message: { offset: 9, partition: 1 },
      done: false,
    });
  });
});
