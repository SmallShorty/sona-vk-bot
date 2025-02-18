// managers.js
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
const { SceneManager } = require('@vk-io/scenes');
const { QuestionManager } = require('vk-io-question');

const hearManager = new HearManager();
const sessionManager = new SessionManager();
const sceneManager = new SceneManager();
const questionManager = new QuestionManager();

function initializeManagers() {
  return { hearManager, sessionManager, sceneManager, questionManager };
}

module.exports = { hearManager, sessionManager, sceneManager, questionManager, initializeManagers };
