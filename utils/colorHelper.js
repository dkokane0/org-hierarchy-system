const colorPool = [
    "#F6AF8E", "#C3A5FF", "#B1D0A5", "#F6ED8E", "#8EF4F6",
    "#C0F68E", "#F68ECB", "#8E97F6", "#F68EAB", "#F6CE8E", "#DFF68E"
  ];
  const userColorIndex = {};
  
  function getNextColorForUser(userId) {
    if (!userColorIndex[userId]) userColorIndex[userId] = 0;
    const color = colorPool[userColorIndex[userId]];
    userColorIndex[userId] = (userColorIndex[userId] + 1) % colorPool.length;
    
    console.log(`Assigned color ${color} for node ID ${userId}`);
    return color;
  }
  
  module.exports = { getNextColorForUser };
  