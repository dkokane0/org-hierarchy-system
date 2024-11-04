const { createNode, updateNode, deleteNode, getNodesTree } = require("./nodeController");
const Node = require("../models/nodeModel");
const { getNextColorForUser } = require("../utils/colorHelper");
const { hasCycle } = require("../utils/cycleDetector");

// Mock functions
jest.mock("../models/nodeModel");
jest.mock("../utils/colorHelper");
jest.mock("../utils/cycleDetector");

describe("Node Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createNode", () => {
    it("should create a node successfully", async () => {
      req.body = { nodeId: "1", nodeName: "Test Node", nodeType: "location", parentId: "0" };
      Node.findByPk.mockResolvedValue(null);
      hasCycle.mockResolvedValue(false);
      getNextColorForUser.mockReturnValue("blue");
      Node.create.mockResolvedValue({ NODE_ID: "1", NODE_NAME: "Test Node", NODE_TYPE: "location", NODE_COLOR: "blue" });

      await createNode(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Node created", node: expect.any(Object) });
    });

    it("should return an error if node ID already exists", async () => {
      req.body = { nodeId: "1", nodeName: "Duplicate Node" };
      Node.findByPk.mockResolvedValue(true);

      await createNode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Node ID already exists" });
    });

    it("should return an error if a cycle is detected", async () => {
      req.body = { nodeId: "1", parentId: "2" };
      Node.findByPk.mockResolvedValue(null);
      hasCycle.mockResolvedValue(true);

      await createNode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Cycle detected" });
    });
  });

  describe("updateNode", () => {
    it("should update node successfully", async () => {
      req.params.nodeId = "1";
      req.body = { nodeName: "Updated Node", parentId: "0", option: "shiftChildrenUp" };
      const nodeMock = { NODE_ID: "1", update: jest.fn() };
      Node.findByPk.mockResolvedValue(nodeMock);
      hasCycle.mockResolvedValue(false);
      Node.update.mockResolvedValue(true);

      await updateNode(req, res);

      expect(nodeMock.update).toHaveBeenCalledWith({ NODE_NAME: "Updated Node", PARENT_ID: "0" });
      expect(res.json).toHaveBeenCalledWith({ message: "Node updated", node: nodeMock });
    });

    it("should return an error if node is not found", async () => {
      req.params.nodeId = "2";
      Node.findByPk.mockResolvedValue(null);

      await updateNode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Node not found" });
    });

    it("should return an error if a cycle is detected", async () => {
      req.params.nodeId = "1";
      req.body = { parentId: "2" };
      const nodeMock = { NODE_ID: "1" };
      Node.findByPk.mockResolvedValue(nodeMock);
      hasCycle.mockResolvedValue(true);

      await updateNode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Cycle detected" });
    });
  });

  describe("deleteNode", () => {
    
    it("should return an error if node is not found", async () => {
      req.params.nodeId = "2";
      Node.findByPk.mockResolvedValue(null);

      await deleteNode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Node not found" });
    });
  });

  describe("getNodesTree", () => {
    it("should retrieve nodes tree successfully", async () => {
      Node.findAll.mockResolvedValue([{ NODE_ID: "1" }, { NODE_ID: "2" }]);

      await getNodesTree(req, res);

      expect(res.json).toHaveBeenCalledWith({ nodes: expect.any(Array) });
    });

    it("should return an error if there is an issue retrieving nodes", async () => {
      Node.findAll.mockRejectedValue(new Error("Database error"));

      await getNodesTree(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving organization tree" });
    });
  });
});
