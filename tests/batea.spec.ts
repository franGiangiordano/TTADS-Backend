import { EntityListResponse } from "../src/models/entity.list.response.model";

const { getBateas } = require("../src/controllers/batea");

const Batea = require("../src/models/batea");

const bateasMock = [
  {
    patent: "AAA",
  },
];

jest.mock("../src/models/batea", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
}));

describe("getBateas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get bateas with default parameters", async () => {
    const req = { query: {} };
    const res = { json: jest.fn() };
    const bateasCount = 20;

    Batea.countDocuments.mockResolvedValueOnce(bateasCount);
    Batea.find.mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(bateasMock),
    });

    await getBateas(req, res);

    expect(res.json).toHaveBeenCalledWith(
      new EntityListResponse(bateasMock, bateasCount, 0, 2)
    );
  });
});
