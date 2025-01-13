const { createCanvas } = require('canvas');

async function renderDialogue(data) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');

    return buffer;
}

module.exports = { renderDialogue };
