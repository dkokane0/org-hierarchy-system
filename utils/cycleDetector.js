const Node = require("../models/nodeModel");

async function hasCycle(nodeId, parentId) {
  let currentParent = parentId;
  while (currentParent) {
    if (currentParent === nodeId) {
      console.warn(`Cycle detected for node ID ${nodeId}`);
      return true;
    }
    const parentNode = await Node.findByPk(currentParent);
    currentParent = parentNode ? parentNode.PARENT_ID : null;
  }
  return false;
}

module.exports = { hasCycle };
