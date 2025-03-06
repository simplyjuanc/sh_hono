import { beforeEach, describe, it, vi } from "vitest";

vi.mock("@/dal/users", () => ({
  createUser: vi.fn(),
}));

describe("users router", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("post new user", () => {
    it("should return 200", async () => {
      // test code here
    });

    /* 
    should call the dal with the user data
    should return the user data
    should return erro
     */
  });
});
