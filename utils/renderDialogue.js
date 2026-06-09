const { createCanvas } = require('canvas');

async function renderDialogue(_data) {
    const canvas = createCanvas(200, 200);
    const _ctx = canvas.getContext('2d');

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');

    return buffer;
}

module.exports = { renderDialogue };
