import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { validateReferral } from "@/app/api/referral/validate/service";

const mockGetDiscountsEnabled = vi.hoisted(() => vi.fn());
const mockCustomerRepository = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/discountSettings", () => ({
  getDiscountsEnabled: mockGetDiscountsEnabled,
}));

vi.mock("@/lib/repositories", () => ({
  customerRepository: mockCustomerRepository,
}));

describe("referral validate service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDiscountsEnabled.mockResolvedValue(true);
  });

  it("throws ConflictError when discounts are disabled", async () => {
    mockGetDiscountsEnabled.mockResolvedValue(false);

    await expect(
      validateReferral({ referralCode: "CODE_123", basePrice: 1000 }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("throws generic NotFoundError message for invalid referral code", async () => {
    mockCustomerRepository.findUnique.mockResolvedValue(null);

    await expect(
      validateReferral({ referralCode: "UNKNOWN", basePrice: 1000 }),
    ).rejects.toMatchObject({
      message: "Referral code could not be validated not found",
    });
    await expect(
      validateReferral({ referralCode: "UNKNOWN", basePrice: 1000 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns masked referrer name and computed discount", async () => {
    mockCustomerRepository.findUnique.mockResolvedValue({
      firstname: "Ali",
      lastname: "Yildirim",
      referralCount: 2,
    });

    const result = await validateReferral({
      referralCode: "CODE_123",
      basePrice: 1000,
    });

    expect(result.referrer.name).toBe("Ali Y.");
    expect(result.referrer.referralCount).toBe(2);
    expect(result.discount.rate).toBe(9);
    expect(result.discount.finalPrice).toBe(910);
  });

  it("returns fallback referrer name when source names are empty", async () => {
    mockCustomerRepository.findUnique.mockResolvedValue({
      firstname: "",
      lastname: "",
      referralCount: 0,
    });

    const result = await validateReferral({
      referralCode: "CODE_123",
      basePrice: 500,
    });

    expect(result.referrer.name).toBe("Referral Partner");
    expect(result.discount.rate).toBe(3);
    expect(result.discount.finalPrice).toBe(485);
  });
});
