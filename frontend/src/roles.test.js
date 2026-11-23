import { describe, expect, it } from "vitest";
import { ROLE_HOME, ROLE_LABELS, ROLES } from "./auth/roles.js";
import { ORDER_STATUS, TOUR_STATUS } from "./labels.js";

describe("roles", () => {
  it("sends each role to its home page", () => {
    expect(ROLE_HOME[ROLES.DISPATCHER]).toBe("/tours");
    expect(ROLE_HOME[ROLES.DRIVER]).toBe("/my-tours");
  });

  it("has a Slovenian label for every role", () => {
    expect(ROLE_LABELS[ROLES.DISPATCHER]).toBe("Disponent");
    expect(ROLE_LABELS[ROLES.DRIVER]).toBe("Voznik");
    expect(ROLE_LABELS[ROLES.ADMIN]).toBe("Administrator");
  });
});

describe("status labels", () => {
  it("names the tour statuses", () => {
    expect(TOUR_STATUS.DRAFT.label).toBe("Osnutek");
    expect(TOUR_STATUS.CONFIRMED.label).toBe("Potrjena");
    expect(TOUR_STATUS.IN_DELIVERY.label).toBe("V dostavi");
    expect(TOUR_STATUS.COMPLETED.label).toBe("Zaključena");
  });

  it("names a delivered and a new order", () => {
    expect(ORDER_STATUS.DELIVERED.label).toBe("Dostavljeno");
    expect(ORDER_STATUS.NEW.label).toBe("Novo");
  });
});
