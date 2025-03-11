import { vi } from "vitest";

import type { Database } from "@/db";

export function mockQueryFromDb(db: Database, mockResult?: any) {
  db.select = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResult ? [mockResult] : []),
    }),
  });
}

export function mockFailedQueryFromDb(db: Database, error: Error) {
  db.select = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockImplementation(() => Promise.reject(error)),
    }),
  });
}

export function mockInsertIntoDb(db: Database, mockResult: any) {
  db.insert = vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([mockResult]),
    }),
  });
}
