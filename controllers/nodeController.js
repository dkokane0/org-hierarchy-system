const Node = require("../models/nodeModel");
const { getNextColorForUser } = require("../utils/colorHelper");
const { hasCycle } = require("../utils/cycleDetector");

async function createNode(req, res) {
  const { nodeId, nodeName, nodeType, parentId } = req.body;
  console.log(`Attempting to create node with ID ${nodeId}, Name: ${nodeName}, Type: ${nodeType}`);

  try {
    const existingNode = await Node.findByPk(nodeId);
    if (existingNode) {
      return res.status(400).json({ error: "Node ID already exists" });
    }

    if (await hasCycle(nodeId, parentId)) {
      return res.status(400).json({ error: "Cycle detected" });
    }

    let color = null;
    if (["location", "department"].includes(nodeType)) {
      color = getNextColorForUser(parentId);
    } else if (nodeType === "employee" && parentId) {
      const parent = await Node.findByPk(parentId);
      color = parent ? parent.NODE_COLOR : null;
    }

    const node = await Node.create({
      NODE_ID: nodeId,
      NODE_NAME: nodeName,
      NODE_TYPE: nodeType,
      NODE_COLOR: color,
      PARENT_ID: parentId,
    });

    console.log(`Node created successfully with ID ${node.NODE_ID}`);
    res.status(201).json({ message: "Node created", node });
  } catch (error) {
    console.error("Error creating node:", error);
    res.status(500).json({ error: "Error creating node" });
  }
}

async function updateNode(req, res) {
  const { nodeId } = req.params;
  const { nodeName, parentId, option } = req.body;
  console.log(`Attempting to update node with ID ${nodeId}`);

  try {
    // Find the node to be updated
    const node = await Node.findByPk(nodeId);
    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    // Check if the node is attempting to become its own parent
    if (nodeId === parentId) {
      return res.status(400).json({ error: "Node cannot be its own parent" });
    }

    // Check for cyclic relationships
    if (await hasCycle(nodeId, parentId)) {
      return res.status(400).json({ error: "Cycle detected" });
    }

    // Handle options for updating child nodes
    if (option === "shiftChildrenUp") {
      // Update the children of the node to the new parentId
      await Node.update({ PARENT_ID: parentId }, { where: { PARENT_ID: nodeId } });
      console.log(`Shifted children of node ID ${nodeId} to parent ID ${parentId}`);
    } else if (option === "moveWithChildren") {
      // Retrieve and update all descendant nodes of the current node
      const updateDescendants = async (currentId, newParentId) => {
        const children = await Node.findAll({ where: { PARENT_ID: currentId } });
        for (const child of children) {
          await child.update({ PARENT_ID: newParentId });
          await updateDescendants(child.NODE_ID, child.NODE_ID);
        }
      };

      // Move the current node with its children
      await updateDescendants(nodeId, parentId);
      console.log(`Moved node ID ${nodeId} and its descendants under new parent ID ${parentId}`);
    } else {
      return res.status(400).json({ error: "Invalid option" });
    }

    // Update the node's own properties
    await node.update({ NODE_NAME: nodeName, PARENT_ID: parentId });
    console.log(`Node updated successfully with ID ${node.NODE_ID}`);
    res.json({ message: "Node updated", node });
  } catch (error) {
    console.error("Error updating node:", error);
    res.status(500).json({ error: "Error updating node" });
  }
}


async function deleteNode(req, res) {
  const { nodeId } = req.params;
  const { option } = req.body;
  console.log(`Attempting to delete node with ID ${nodeId}`);

  try {
    const node = await Node.findByPk(nodeId);
    if (!node) {
      console.warn(`Node with ID ${nodeId} not found`);
      return res.status(404).json({ error: "Node not found" });
    }

    if (option === "removeWithChildren") {
      // Remove the node and all its descendants
      await deleteSubtree(nodeId);
      console.log(`Deleted node with ID ${nodeId} and all its descendants`);
    } else if (option === "shiftChildrenUp") {
      // Update children to point to the current node's parent
      await Node.update(
        { PARENT_ID: node.PARENT_ID },
        { where: { PARENT_ID: nodeId } }
      );
      console.log(`Shifted children of node ID ${nodeId} to parent ID ${node.PARENT_ID}`);
    } else {
      return res.status(400).json({ error: "Invalid option" });
    }

    // Delete the node itself
    await node.destroy();
    console.log(`Node deleted successfully with ID ${nodeId}`);
    res.json({ message: "Node deleted" });
  } catch (error) {
    console.error("Error deleting node:", error);
    res.status(500).json({ error: "Error deleting node" });
  }
}

// Helper function to delete a node and all of its descendants
async function deleteSubtree(nodeId) {
  // Find all child nodes of the current node
  const children = await Node.findAll({ where: { PARENT_ID: nodeId } });

  // Recursively delete each child and its subtree
  for (const child of children) {
    await deleteSubtree(child.NODE_ID);
  }

  // Delete the node itself
  await Node.destroy({ where: { NODE_ID: nodeId } });
}


async function getNodesTree(req, res) {
  try {
    const nodes = await Node.findAll();
    res.json({ nodes });
  } catch (error) {
    console.log("Error retrieving organization tree", error);
    res.status(500).json({ error: "Error retrieving organization tree" });
  }
}

module.exports = { createNode, updateNode, deleteNode, getNodesTree };
