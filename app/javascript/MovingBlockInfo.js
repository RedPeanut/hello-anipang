var eMovingStatus = { NONE: 0, FORWARD: 1, REVERSE: 2 },
    movingStatus = null;

function MovingBlockInfo() {
    this.imgIdx = null,
    this.row = null, this.col = null,
    this.direction = null, 
    this.left = 0, this.top = 0,
    this.velocityX = 0, this.velocityY = 0,
    this.deltaX = 0, this.deltaY = 0;
}

MovingBlockInfo.prototype = {
};