const express = require("express");
const { createNode, updateNode, deleteNode, getNodesTree } = require("../controllers/nodeController");

const router = express.Router();
/**
 * @swagger
 * /api/nodes:
 *   post:
 *     summary: Create a new node in the organization tree
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nodeId:
 *                 type: integer
 *               nodeName:
 *                 type: string
 *               nodeType:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Node created successfully
 */
router.post("/nodes", createNode);

/**
 * @swagger
 * /api/nodes/{nodeId}:
 *   put:
 *     summary: Update a node's details or parent
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nodeName:
 *                 type: string
 *               parentId:
 *                 type: integer
 *               option:
 *                 type: string
 *                 enum: [moveWithChildren, shiftChildrenUp]
 *     responses:
 *       200:
 *         description: Node updated successfully
 */
router.put("/nodes/:nodeId", updateNode);

/**
 * @swagger
 * /api/nodes/{nodeId}:
 *   delete:
 *     summary: Delete a node
 *     parameters:
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option:
 *                 type: string
 *                 enum: [removeWithChildren, shiftChildrenUp]
 *     responses:
 *       200:
 *         description: Node deleted successfully
 */
router.delete("/nodes/:nodeId", deleteNode);

/**
 * @swagger
 * /api/nodes/tree:
 *   get:
 *     summary: Retrieve the organization tree structure
 *     responses:
 *       200:
 *         description: Organization tree retrieved successfully
 */
router.get("/nodes/tree", getNodesTree)

module.exports = router;
