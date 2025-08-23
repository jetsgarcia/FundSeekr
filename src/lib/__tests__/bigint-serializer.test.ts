/**
 * Unit tests for BigInt serialization utilities
 */

import { serializeBigInt, bigIntReplacer } from "../bigint-serializer";

describe("serializeBigInt", () => {
  describe("primitive values", () => {
    it("should return null when input is null", () => {
      expect(serializeBigInt(null)).toBe(null);
    });

    it("should return undefined when input is undefined", () => {
      expect(serializeBigInt(undefined)).toBe(undefined);
    });

    it("should convert BigInt to string", () => {
      const bigintValue = BigInt(123456789012345);
      expect(serializeBigInt(bigintValue)).toBe("123456789012345");
    });

    it("should handle zero BigInt", () => {
      const bigintValue = BigInt(0);
      expect(serializeBigInt(bigintValue)).toBe("0");
    });

    it("should handle negative BigInt", () => {
      const bigintValue = BigInt(-987654321);
      expect(serializeBigInt(bigintValue)).toBe("-987654321");
    });

    it("should handle very large BigInt values", () => {
      const bigintValue = BigInt("123456789012345678901234567890");
      expect(serializeBigInt(bigintValue)).toBe(
        "123456789012345678901234567890"
      );
    });

    it("should return string unchanged", () => {
      const stringValue = "hello world";
      expect(serializeBigInt(stringValue)).toBe("hello world");
    });

    it("should return number unchanged", () => {
      const numberValue = 42;
      expect(serializeBigInt(numberValue)).toBe(42);
    });

    it("should return boolean unchanged", () => {
      expect(serializeBigInt(true)).toBe(true);
      expect(serializeBigInt(false)).toBe(false);
    });
  });

  describe("arrays", () => {
    it("should handle empty array", () => {
      expect(serializeBigInt([])).toEqual([]);
    });

    it("should serialize BigInt values in array", () => {
      const input = [BigInt(123), "string", 456, BigInt(789)];
      const expected = ["123", "string", 456, "789"];
      expect(serializeBigInt(input)).toEqual(expected);
    });

    it("should handle nested arrays with BigInt", () => {
      const input = [BigInt(123), [BigInt(456), "nested"], BigInt(789)];
      const expected = ["123", ["456", "nested"], "789"];
      expect(serializeBigInt(input)).toEqual(expected);
    });

    it("should handle array with mixed types", () => {
      const input = [
        BigInt(123),
        null,
        undefined,
        "string",
        456,
        true,
        { id: BigInt(789) },
      ];
      const expected = [
        "123",
        null,
        undefined,
        "string",
        456,
        true,
        { id: "789" },
      ];
      expect(serializeBigInt(input)).toEqual(expected);
    });
  });

  describe("objects", () => {
    it("should handle empty object", () => {
      expect(serializeBigInt({})).toEqual({});
    });

    it("should serialize BigInt properties in object", () => {
      const input = {
        id: BigInt(123),
        name: "test",
        count: 456,
        isActive: true,
      };
      const expected = {
        id: "123",
        name: "test",
        count: 456,
        isActive: true,
      };
      expect(serializeBigInt(input)).toEqual(expected);
    });

    it("should handle nested objects with BigInt", () => {
      const input = {
        user: {
          id: BigInt(123),
          profile: {
            userId: BigInt(123),
            score: BigInt(9999),
          },
        },
        metadata: {
          timestamp: BigInt(1640995200000),
        },
      };
      const expected = {
        user: {
          id: "123",
          profile: {
            userId: "123",
            score: "9999",
          },
        },
        metadata: {
          timestamp: "1640995200000",
        },
      };
      expect(serializeBigInt(input)).toEqual(expected);
    });

    it("should handle object with array containing BigInt", () => {
      const input = {
        ids: [BigInt(1), BigInt(2), BigInt(3)],
        data: {
          values: [BigInt(100), BigInt(200)],
        },
      };
      const expected = {
        ids: ["1", "2", "3"],
        data: {
          values: ["100", "200"],
        },
      };
      expect(serializeBigInt(input)).toEqual(expected);
    });

    it("should handle object with null and undefined values", () => {
      const input = {
        id: BigInt(123),
        name: null,
        description: undefined,
        count: BigInt(0),
      };
      const expected = {
        id: "123",
        name: null,
        description: undefined,
        count: "0",
      };
      expect(serializeBigInt(input)).toEqual(expected);
    });
  });

  describe("complex nested structures", () => {
    it("should handle deeply nested structure with multiple BigInt values", () => {
      const input = {
        users: [
          {
            id: BigInt(1),
            posts: [
              { id: BigInt(101), likes: BigInt(50) },
              { id: BigInt(102), likes: BigInt(25) },
            ],
          },
          {
            id: BigInt(2),
            posts: [{ id: BigInt(201), likes: BigInt(100) }],
          },
        ],
        metadata: {
          totalUsers: BigInt(2),
          totalPosts: BigInt(3),
          timestamps: [BigInt(1640995200000), BigInt(1640995260000)],
        },
      };

      const expected = {
        users: [
          {
            id: "1",
            posts: [
              { id: "101", likes: "50" },
              { id: "102", likes: "25" },
            ],
          },
          {
            id: "2",
            posts: [{ id: "201", likes: "100" }],
          },
        ],
        metadata: {
          totalUsers: "2",
          totalPosts: "3",
          timestamps: ["1640995200000", "1640995260000"],
        },
      };

      expect(serializeBigInt(input)).toEqual(expected);
    });
  });

  describe("edge cases", () => {
    it("should handle Date objects by converting them to plain objects", () => {
      const date = new Date("2024-01-01");
      const result = serializeBigInt(date);
      // Date objects are treated as objects and their properties are extracted
      expect(typeof result).toBe("object");
      expect(result).not.toBe(date); // It's converted to a plain object
    });

    it("should handle object with prototype methods", () => {
      class TestClass {
        id = BigInt(123);
        name = "test";

        getName() {
          return this.name;
        }
      }

      const instance = new TestClass();
      const result = serializeBigInt(instance);

      expect(result).toEqual({
        id: "123",
        name: "test",
      });
    });

    it("should handle complex objects by converting them to plain objects", () => {
      const input = {
        id: BigInt(123),
        regex: /test/g,
        date: new Date("2024-01-01"),
        func: () => "test",
      };

      const result = serializeBigInt(input);

      expect(result.id).toBe("123");
      // Complex objects are converted to plain objects with their enumerable properties
      expect(typeof result.regex).toBe("object");
      expect(typeof result.date).toBe("object");
      // Functions remain as functions since they're not objects
      expect(typeof result.func).toBe("function");
    });
  });
});

describe("bigIntReplacer", () => {
  it("should convert BigInt to string", () => {
    const bigintValue = BigInt(123456789);
    expect(bigIntReplacer("key", bigintValue)).toBe("123456789");
  });

  it("should handle zero BigInt", () => {
    const bigintValue = BigInt(0);
    expect(bigIntReplacer("key", bigintValue)).toBe("0");
  });

  it("should handle negative BigInt", () => {
    const bigintValue = BigInt(-987654321);
    expect(bigIntReplacer("key", bigintValue)).toBe("-987654321");
  });

  it("should handle very large BigInt", () => {
    const bigintValue = BigInt("123456789012345678901234567890");
    expect(bigIntReplacer("key", bigintValue)).toBe(
      "123456789012345678901234567890"
    );
  });

  it("should return non-BigInt values unchanged", () => {
    expect(bigIntReplacer("key", "string")).toBe("string");
    expect(bigIntReplacer("key", 123)).toBe(123);
    expect(bigIntReplacer("key", true)).toBe(true);
    expect(bigIntReplacer("key", null)).toBe(null);
    expect(bigIntReplacer("key", undefined)).toBe(undefined);
    expect(bigIntReplacer("key", [])).toEqual([]);
    expect(bigIntReplacer("key", {})).toEqual({});
  });

  it("should work with JSON.stringify", () => {
    const input = {
      id: BigInt(123),
      name: "test",
      count: 456,
      bigNumber: BigInt("999999999999999999999"),
    };

    const jsonString = JSON.stringify(input, bigIntReplacer);
    const expected =
      '{"id":"123","name":"test","count":456,"bigNumber":"999999999999999999999"}';

    expect(jsonString).toBe(expected);
  });

  it("should work with JSON.stringify for nested structures", () => {
    const input = {
      user: {
        id: BigInt(123),
        posts: [
          { id: BigInt(1), likes: BigInt(50) },
          { id: BigInt(2), likes: BigInt(25) },
        ],
      },
    };

    const jsonString = JSON.stringify(input, bigIntReplacer);
    const expected =
      '{"user":{"id":"123","posts":[{"id":"1","likes":"50"},{"id":"2","likes":"25"}]}}';

    expect(jsonString).toBe(expected);
  });

  it("should handle arrays with JSON.stringify", () => {
    const input = [BigInt(1), "string", BigInt(2), 123, BigInt(3)];
    const jsonString = JSON.stringify(input, bigIntReplacer);
    const expected = '["1","string","2",123,"3"]';

    expect(jsonString).toBe(expected);
  });
});

describe("Integration tests", () => {
  it("should work together for API response serialization", () => {
    // Simulate a typical API response that might come from Prisma
    const apiResponse = {
      users: [
        {
          id: BigInt(1),
          email: "user1@example.com",
          createdAt: new Date("2024-01-01"),
          profile: {
            id: BigInt(101),
            userId: BigInt(1),
            bio: "User bio",
            followerCount: BigInt(1250),
          },
        },
        {
          id: BigInt(2),
          email: "user2@example.com",
          createdAt: new Date("2024-01-02"),
          profile: {
            id: BigInt(102),
            userId: BigInt(2),
            bio: "Another bio",
            followerCount: BigInt(500),
          },
        },
      ],
      pagination: {
        total: BigInt(2),
        page: 1,
        limit: 10,
        hasMore: false,
      },
    };

    // Test serializeBigInt
    const serialized = serializeBigInt(apiResponse);
    expect(serialized.users[0].id).toBe("1");
    expect(serialized.users[0].profile.followerCount).toBe("1250");
    expect(serialized.pagination.total).toBe("2");

    // Test that it can be JSON stringified without issues
    const jsonString = JSON.stringify(serialized);
    expect(() => JSON.parse(jsonString)).not.toThrow();

    // Test bigIntReplacer directly
    const jsonWithReplacer = JSON.stringify(apiResponse, bigIntReplacer);
    expect(() => JSON.parse(jsonWithReplacer)).not.toThrow();

    const parsed = JSON.parse(jsonWithReplacer);
    expect(parsed.users[0].id).toBe("1");
    expect(parsed.users[0].profile.followerCount).toBe("1250");
    expect(parsed.pagination.total).toBe("2");
  });
});
