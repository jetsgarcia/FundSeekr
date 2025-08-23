/**
 * Utility functions for handling BigInt serialization in API responses
 */

/**
 * Recursively converts BigInt values to strings in an object
 * @param obj - The object to process
 * @returns The object with BigInt values converted to strings
 */
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return obj.toString() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeBigInt(item)) as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value);
    }
    return result as T;
  }

  return obj;
}

/**
 * Custom JSON.stringify replacer function for BigInt values
 */
export function bigIntReplacer(key: string, value: unknown) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
