// managers.js
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
const { SceneManager } = require('@vk-io/scenes');

const hearManager = new HearManager();
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();

function initializeManagers() {
  return { hearManager, sessionManager, sceneManager };
}

module.exports = { hearManager, sessionManager, sceneManager, initializeManagers };
