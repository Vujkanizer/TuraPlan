import { describe, expect, it } from "vitest";
import {
  addDays,
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPallets,
  pluralize,
  todayIso,
} from "./format.js";

const FORMS = ["naročilo", "naročili", "naročila", "naročil"];

describe("formatNumber", () => {
  it("groups thousands with a dot", () => {
    expect(formatNumber(1200)).toBe("1.200");
  });

  it("uses a comma for the decimal part", () => {
    expect(formatNumber(3.5)).toBe("3,5");
  });
});

describe("formatDate", () => {
  it("formats a date in Slovenian", () => {
    expect(formatDate("2026-11-10")).toBe("10. 11. 2026");
  });
});

describe("formatDateTime", () => {
  it("shows a dash when the time is missing", () => {
    expect(formatDateTime(null)).toBe("–");
    expect(formatDateTime("")).toBe("–");
  });

  it("includes the clock time", () => {
    expect(formatDateTime("2026-11-10T14:30:00")).toContain("14:30");
  });
});

describe("todayIso", () => {
  it("returns today's date as YYYY-MM-DD", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("formatDuration", () => {
  it("shows minutes under one hour", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("splits hours and minutes", () => {
    expect(formatDuration(125)).toBe("2 h 5 min");
  });
});

describe("addDays", () => {
  it("adds days inside the same month", () => {
    expect(addDays("2026-11-10", 3)).toBe("2026-11-13");
  });

  it("crosses into the next month", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
});

describe("formatPallets", () => {
  it("uses the accusative forms", () => {
    expect(formatPallets(1)).toBe("1 paleto");
    expect(formatPallets(2)).toBe("2 paleti");
    expect(formatPallets(5)).toBe("5 palet");
  });

  it("uses palete for a fraction", () => {
    expect(formatPallets(1.5)).toBe("1,5 palete");
  });
});

describe("pluralize", () => {
  it("picks the form for one, two and five", () => {
    expect(pluralize(1, FORMS)).toBe("1 naročilo");
    expect(pluralize(2, FORMS)).toBe("2 naročili");
    expect(pluralize(5, FORMS)).toBe("5 naročil");
  });
});
