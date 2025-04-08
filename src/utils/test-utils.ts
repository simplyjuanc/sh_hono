import { vi } from "vitest";

import type { Database } from "@/db";

export function mockQuerySuccessFromDb(db: Database, mockResult?: any) {
  db.select = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResult ? [mockResult] : []),
    }),
  });
}

export function mockQueryFailureFromDb(db: Database, error: Error) {
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

export function mockDeleteFromDb(db: Database, mockResult: any) {
  db.update = vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockResult]),
      }),
    }),
  });
}
