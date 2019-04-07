function GlobalInfo(rowSize, colSize) {
    
    this.matrix = new Array(rowSize);
    //this.bitmap = undefined;
    this.bitmapDropping = new Array(rowSize);
    this.bitmapBombing = new Array(rowSize);
    
    var row, col;
    
    for(row = 0; row < this.matrix.length; row++) {
        this.matrix[row] = new Array(colSize);
        for(col = 0; col < this.matrix[row].length; col++) {
            this.matrix[row][col] = new Block(null, eBlockStatus.NONE);
        }
    }
    
    for(row = 0; row < rowSize; row++) { this.bitmapDropping[row] = 0; this.bitmapBombing = 0; }
    
    // for bombing
    this.lastTime;
    this.bombIdx;
    
    // save
    this.nRowSize = rowSize, this.nColSize = colSize;
    
}

GlobalInfo.prototype = {
};