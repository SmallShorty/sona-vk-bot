// stringExtension.js
String.prototype.capital = function () {
    if (this.length === 0) return this;
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {};
