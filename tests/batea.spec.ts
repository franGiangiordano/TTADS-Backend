import { Messages } from "../src/constants/messages.constant";
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
      limit: jest.fn().mockResolvedValue(bateasMock)
    });

    await getBateas(req, res);

    expect(res.json).toHaveBeenCalledWith(new EntityListResponse(bateasMock, bateasCount, 0, 2));
  });

  it('should get bateas with custom parameters', async () => {
    const req = { query: { page: 3, limit: 2, search: "SearchTest" } };
    const res = { json: jest.fn() };
    const bateasCount = 20;
    const startIndexExpected = 4;

    Batea.countDocuments.mockResolvedValueOnce(bateasCount);
    Batea.find.mockImplementation((searchOptions: BateaSearchOptions) => {
      if (searchOptions.patent.$regex == req.query.search)
        return {
          skip: jest.fn(function (startIndex) {
            if (startIndex == startIndexExpected)
              return this;
          }),
          limit: jest.fn().mockImplementation((limitPerPage) => {
            if (limitPerPage == req.query.limit)
              return bateasMock
          })
        }
    });

    await getBateas(req, res);

    expect(res.json).toHaveBeenCalledWith(new EntityListResponse(bateasMock, bateasCount, startIndexExpected, 10));
  });

  it('should return 500 with correct message when error', async () => {
    const req = { query: { page: 3, limit: 2, search: "SearchTest" } };
    const res = { json: jest.fn(), status: jest.fn() };
    const bateasCount = 20;

    Batea.find.mockImplementation(() => {
      throw new Error;
    });

    res.status.mockReturnValue(res);

    await getBateas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: Messages.CannotGetBatea });
  });
});
