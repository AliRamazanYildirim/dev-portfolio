import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => {
  const indexes = vi.fn();
  const dropIndex = vi.fn();
  const createIndex = vi.fn();
  const findOneAndUpdateExec = vi.fn();
  const connectToMongo = vi.fn();
  const findOneAndUpdate = vi.fn(() => ({ exec: findOneAndUpdateExec }));

  const modelObject = {
    collection: {
      indexes,
      dropIndex,
      createIndex,
    },
    findOneAndUpdate,
  };

  const models: Record<string, unknown> = {};

  class MockSchema {
    index(): void {
      // no-op
    }
  }

  const mockMongoose = {
    models,
    Schema: MockSchema,
    model: vi.fn((name: string) => {
      if (!models[name]) {
        models[name] = modelObject;
      }
      return models[name];
    }),
  };

  return {
    indexes,
    dropIndex,
    createIndex,
    findOneAndUpdate,
    findOneAndUpdateExec,
    connectToMongo,
    modelObject,
    models,
    mockMongoose,
  };
});

vi.mock("@/lib/mongodb", () => ({
  default: mockState.mockMongoose,
  connectToMongo: mockState.connectToMongo,
}));

async function importRateLimiterModule() {
  vi.resetModules();
  return import("@/lib/mongoRateLimiter");
}

describe("mongo rate limiter index migration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    for (const key of Object.keys(mockState.models)) {
      delete mockState.models[key];
    }

    mockState.connectToMongo.mockResolvedValue(undefined);
    mockState.findOneAndUpdateExec.mockResolvedValue({
      count: 1,
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    });
  });

  it("migrates legacy expiresAt index to TTL index", async () => {
    mockState.indexes.mockResolvedValue([
      {
        name: "_id_",
        key: { _id: 1 },
      },
      {
        name: "expiresAt_1",
        key: { expiresAt: 1 },
      },
    ]);
    mockState.dropIndex.mockResolvedValue(undefined);
    mockState.createIndex.mockResolvedValue("expiresAt_1");

    const { checkRateLimitKey } = await importRateLimiterModule();
    const result = await checkRateLimitKey("key-1", 60, 5);

    expect(result.allowed).toBe(true);
    expect(mockState.dropIndex).toHaveBeenCalledWith("expiresAt_1");
    expect(mockState.createIndex).toHaveBeenCalledWith(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
  });

  it("skips migration when TTL index is already present", async () => {
    mockState.indexes.mockResolvedValue([
      {
        name: "expiresAt_1",
        key: { expiresAt: 1 },
        expireAfterSeconds: 0,
      },
    ]);

    const { checkRateLimitKey } = await importRateLimiterModule();
    const result = await checkRateLimitKey("key-2", 60, 5);

    expect(result.allowed).toBe(true);
    expect(mockState.dropIndex).not.toHaveBeenCalled();
    expect(mockState.createIndex).not.toHaveBeenCalled();
  });
});
