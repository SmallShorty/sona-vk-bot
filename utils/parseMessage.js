function getContent (message) {
    const content = {};
    if (message.text) {
        content.text = message.text;
    }
    return content;
}

function parseMessage(node) {
    if (!node) return null;
  
    // Формируем текущий узел
    const currentNode = {
      senderId: node.senderId,
      content: getContent(node),
      children: []
    };
  
    if (node.replyMessage) {
      const childNode = parseMessage(node.replyMessage);
      if (childNode) {
        currentNode.children.push(childNode);
      }
    }
  
    if (node.forwards && Array.isArray(node.forwards)) {
      for (const child of node.forwards) {
        const childNode = parseMessage(child);
        if (childNode) {
          currentNode.children.push(childNode);
        }
      }
    }
  
    return currentNode;
  }
module.exports = { parseMessage }
