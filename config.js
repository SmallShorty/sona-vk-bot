"use strict";

module.exports = {
  PREFIX: "!",

  // VK peer_id беседы для приёма баг-репортов
  BUG_REPORT_PEER_ID: 2000000003,

  // Смещение peer_id групповых бесед в VK (peerId - offset = group message id)
  VK_PEER_OFFSET: 2000000000,

  DICE_MIN_RANGE: 2,
  DICE_MAX_RANGE: 100,
  DICE_DEFAULT_RANGE: 20,
};
