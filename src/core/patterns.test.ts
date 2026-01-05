import { test, expect, describe } from "vitest";
import { classifyVariable, classifyVariables, getDefaultConfig } from "./patterns";
import { AccessLevel } from "./types";

describe("classifyVariable", () => {
  describe("HIDDEN patterns", () => {
    test("classifies STRIPE_SECRET as HIDDEN", () => {
      expect(classifyVariable("STRIPE_SECRET")?.access).toBe(AccessLevel.HIDDEN);
    });

    test("classifies STRIPE_SECRET_KEY as HIDDEN", () => {
      expect(classifyVariable("STRIPE_SECRET_KEY")?.access).toBe(AccessLevel.HIDDEN);
    });

    test("classifies RSA_PRIVATE_KEY as HIDDEN", () => {
      expect(classifyVariable("RSA_PRIVATE_KEY")?.access).toBe(AccessLevel.HIDDEN);
    });

    test("classifies SIGNING_SECRET as HIDDEN", () => {
      expect(classifyVariable("SIGNING_SECRET")?.access).toBe(AccessLevel.HIDDEN);
    });
  });

  describe("PLACEHOLDER patterns", () => {
    test("classifies OPENAI_API_KEY as PLACEHOLDER", () => {
      expect(classifyVariable("OPENAI_API_KEY")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies API_KEY as PLACEHOLDER", () => {
      expect(classifyVariable("API_KEY")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies SECRET_KEY as PLACEHOLDER", () => {
      expect(classifyVariable("SECRET_KEY")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies AWS_ACCESS_KEY as PLACEHOLDER", () => {
      expect(classifyVariable("AWS_ACCESS_KEY")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies AUTH_TOKEN as PLACEHOLDER", () => {
      expect(classifyVariable("AUTH_TOKEN")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies DB_PASSWORD as PLACEHOLDER", () => {
      expect(classifyVariable("DB_PASSWORD")?.access).toBe(AccessLevel.PLACEHOLDER);
    });

    test("classifies GITHUB_TOKEN as PLACEHOLDER", () => {
      expect(classifyVariable("GITHUB_TOKEN")?.access).toBe(AccessLevel.PLACEHOLDER);
    });
  });

  describe("READ_ONLY patterns", () => {
    test("classifies DATABASE_URL as READ_ONLY", () => {
      expect(classifyVariable("DATABASE_URL")?.access).toBe(AccessLevel.READ_ONLY);
    });

    test("classifies REDIS_URL as READ_ONLY", () => {
      expect(classifyVariable("REDIS_URL")?.access).toBe(AccessLevel.READ_ONLY);
    });

    test("classifies MONGODB_URI as READ_ONLY", () => {
      expect(classifyVariable("MONGODB_URI")?.access).toBe(AccessLevel.READ_ONLY);
    });

    test("classifies API_URL as READ_ONLY", () => {
      expect(classifyVariable("API_URL")?.access).toBe(AccessLevel.READ_ONLY);
    });

    test("classifies DB_HOST as READ_ONLY", () => {
      expect(classifyVariable("DB_HOST")?.access).toBe(AccessLevel.READ_ONLY);
    });
  });

  describe("FULL patterns", () => {
    test("classifies NODE_ENV as FULL", () => {
      expect(classifyVariable("NODE_ENV")?.access).toBe(AccessLevel.FULL);
    });

    test("classifies PORT as FULL", () => {
      expect(classifyVariable("PORT")?.access).toBe(AccessLevel.FULL);
    });

    test("classifies DEBUG as FULL", () => {
      expect(classifyVariable("DEBUG")?.access).toBe(AccessLevel.FULL);
    });

    test("classifies LOG_LEVEL as FULL", () => {
      expect(classifyVariable("LOG_LEVEL")?.access).toBe(AccessLevel.FULL);
    });

    test("classifies TIMEOUT as FULL", () => {
      expect(classifyVariable("TIMEOUT")?.access).toBe(AccessLevel.FULL);
    });
  });

  describe("unclassified patterns", () => {
    test("returns undefined for unrecognized patterns", () => {
      expect(classifyVariable("CUSTOM_VAR")).toBeUndefined();
    });
  });

  describe("case insensitivity", () => {
    test("handles lowercase api_key", () => {
      expect(classifyVariable("api_key")?.access).toBe(AccessLevel.PLACEHOLDER);
    });
  });

  describe("pattern priority", () => {
    test("STRIPE_SECRET matches HIDDEN before SECRET (placeholder)", () => {
      expect(classifyVariable("STRIPE_SECRET")?.access).toBe(AccessLevel.HIDDEN);
    });
  });
});

describe("getDefaultConfig", () => {
  test("returns PLACEHOLDER access level", () => {
    expect(getDefaultConfig().access).toBe(AccessLevel.PLACEHOLDER);
  });

  test("returns a description", () => {
    expect(getDefaultConfig().description).toBeDefined();
  });
});

describe("classifyVariables", () => {
  test("classifies multiple variables", () => {
    const result = classifyVariables(["API_KEY", "PORT", "DEBUG"]);
    expect(result.API_KEY.access).toBe(AccessLevel.PLACEHOLDER);
    expect(result.PORT.access).toBe(AccessLevel.FULL);
    expect(result.DEBUG.access).toBe(AccessLevel.FULL);
  });

  test("uses default for unclassified variables", () => {
    const result = classifyVariables(["CUSTOM_VAR"]);
    expect(result.CUSTOM_VAR.access).toBe(AccessLevel.PLACEHOLDER);
  });

  test("handles empty array", () => {
    const result = classifyVariables([]);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
