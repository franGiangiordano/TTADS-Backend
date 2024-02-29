import { Messages } from "../src/constants/messages.constant";
import {
  createBatea,
  deletebateaById,
  getBateaById,
  updatebateaById,
} from "../src/controllers/batea";
import { EntityListResponse } from "../src/models/entity.list.response.model";

const { getBateas } = require("../src/controllers/batea");

const Batea = require("../src/models/batea");
const Equipment = require("../src/models/equipment");

const bateasMock = [
  {
    patent: "AAA",
  },
];

const EquipmentMock = [
  {
    description: "descriptionTest",
    driver: "1",
    batea: "2",
    trailer: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

jest.mock("../src/models/batea", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock("../src/models/equipment", () => ({
  findOne: jest.fn(),
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

  it("should get bateas with custom parameters", async () => {
    const req = { query: { page: 3, limit: 2, search: "SearchTest" } };
    const res = { json: jest.fn() };
    const bateasCount = 20;
    const startIndexExpected = 4;

    Batea.countDocuments.mockResolvedValueOnce(bateasCount);
    Batea.find.mockImplementation((searchOptions: BateaSearchOptions) => {
      if (searchOptions.patent.$regex == req.query.search)
        return {
          skip: jest.fn(function (startIndex) {
            if (startIndex == startIndexExpected) return this;
          }),
          limit: jest.fn().mockImplementation((limitPerPage) => {
            if (limitPerPage == req.query.limit) return bateasMock;
          }),
        };
    });

    await getBateas(req, res);

    expect(res.json).toHaveBeenCalledWith(
      new EntityListResponse(bateasMock, bateasCount, startIndexExpected, 10)
    );
  });

  it("should return 500 with correct message when error", async () => {
    const req = { query: { page: 3, limit: 2, search: "SearchTest" } };
    const res = { json: jest.fn(), status: jest.fn() };
    const bateasCount = 20;

    Batea.find.mockImplementation(() => {
      throw new Error();
    });

    res.status.mockReturnValue(res);

    await getBateas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: Messages.CannotGetBatea });
  });

  it("should delete batea", async () => {
    const req = { params: { bateaId: "1" } };
    const res = { json: jest.fn(), status: jest.fn() };

    Equipment.findOne.mockReturnValueOnce(undefined);

    res.status.mockReturnValue(res);

    Batea.findByIdAndDelete.mockResolvedValueOnce(req.params.bateaId);
    await deletebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should return 404 with correct message when batea not found", async () => {
    const req = { params: { bateaId: "2" } };
    const res = { json: jest.fn(), status: jest.fn() };

    Equipment.findOne.mockReturnValueOnce(undefined);
    res.status.mockReturnValue(res);

    Batea.findByIdAndDelete.mockResolvedValueOnce();

    await deletebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: Messages.CannotDeleteBatea,
    });
  });

  it("should return 400 with correct message when batea is part of an equipment", async () => {
    const req = { params: { bateaId: "1" } };
    const res = { json: jest.fn(), status: jest.fn() };

    Equipment.findOne.mockReturnValueOnce(req.params.bateaId);
    res.status.mockReturnValue(res);

    await deletebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: Messages.FKViolationBatea,
    });
  });

  it("shuld create a batea and return 201", async () => {
    const req = { body: bateasMock };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.create.mockResolvedValueOnce(bateasMock);

    await createBatea(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(bateasMock);
  });

  it("shuld return 409 when batea already exists", async () => {
    const req = { body: bateasMock };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.create.mockRejectedValueOnce({ code: 11000 });

    await createBatea(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('it should update batea with id "1" and return 200', async () => {
    const req = { body: { patent: "1234" }, params: { bateaId: "1" } };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    const bateasMockUpdated = { ...bateasMock, ...req.body };
    Batea.findByIdAndUpdate.mockResolvedValueOnce(bateasMockUpdated);

    await updatebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bateasMockUpdated);
  });

  it('it should return 404 when batea with id "2" not found', async () => {
    const req = { body: { patent: "1234" }, params: { bateaId: "2" } };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.findByIdAndUpdate.mockResolvedValueOnce();

    await updatebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should return 409 when batea with patent "1234" already exists', async () => {
    const req = { body: { patent: "1234" }, params: { bateaId: "1" } };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.findByIdAndUpdate.mockRejectedValueOnce({ code: 11000 });

    await updatebateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('should return batea with id "1" and return 200', async () => {
    const req = { params: { bateaId: "1" } };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.findById.mockResolvedValueOnce(bateasMock);

    await getBateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bateasMock);
  });

  it('should return 404 when batea with id "2" not found', async () => {
    const req = { params: { bateaId: "2" } };
    const res = { json: jest.fn(), status: jest.fn() };

    res.status.mockReturnValue(res);
    Batea.findById.mockResolvedValueOnce();

    await getBateaById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
