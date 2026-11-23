import { describe, expect, it } from "vitest";
import { groupStops } from "./stopGroups.js";

function stop(id, customerId, customer) {
  return { id, customer_id: customerId, customer };
}

describe("groupStops", () => {
  it("merges consecutive stops of the same customer", () => {
    const groups = groupStops([
      stop(1, 10, "Pekarna Zrno"),
      stop(2, 10, "Pekarna Zrno"),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].stops.map((item) => item.id)).toEqual([1, 2]);
    expect(groups[0].customer).toBe("Pekarna Zrno");
  });

  it("keeps different customers in separate groups", () => {
    const groups = groupStops([
      stop(1, 10, "Pekarna Zrno"),
      stop(2, 20, "Trgovina Most"),
    ]);
    expect(groups.map((group) => group.customerId)).toEqual([10, 20]);
  });

  it("does not merge the same customer when another stop is in between", () => {
    const groups = groupStops([
      stop(1, 10, "Pekarna Zrno"),
      stop(2, 20, "Trgovina Most"),
      stop(3, 10, "Pekarna Zrno"),
    ]);
    expect(groups).toHaveLength(3);
  });
});
