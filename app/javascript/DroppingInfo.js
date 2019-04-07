var DROP_ANI_DURATION = 0.3;
var DROP_ANI_VIEW_AREA_HEIGHT = 20;

function DroppingInfo(rowSize, colSize) {
    
    
    //this.bitmap = undefined;
    //this.existAnyDropBlockInThisRow = undefined; // bitmap
    //this.nDropBlockInThisCol = undefined; // number array
    
    // save
    this.nRowSize = rowSize, this.nColSize = colSize = colSize;
    
    var row, col;
    
    // virtual matrix for dropping
    this.matrix = new Array(rowSize);
    for(row = 0; row < rowSize; row++) {
        this.matrix[row] = new Array(colSize);
        for(col = 0; col < this.nRowSize; col++) {
            this.matrix[row][col] = new Block(null, eBlockStatus.NONE);
        }
    }

    this.nDropBlockInCol_V = new Array(colSize);

    this.deltaX_V, this.velocityX_V,
    this.deltaYInCol_V = new Array(colSize);
    this.distanceYInCol_V = new Array(colSize);
    this.velocityYInCol_V = new Array(colSize);
    
    // 
    
    // to find out the dropping block 
    this.dropFilter = [
          -1,   -1, 0x01,   -1, 0x03, 0x02, 0x01,   -1, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01,   -1, 
        0x0f, 0x0e, 0x0d, 0x0c, 0x0b, 0x0a, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01,   -1, 
        0x1f, 0x1e, 0x1d, 0x1c, 0x1b, 0x1a, 0x19, 0x18, 0x17, 0x16, 0x15, 0x14, 0x13, 0x12, 0x11, 0x10, 
        0x0f, 0x0e, 0x0d, 0x0c, 0x0b, 0x0a, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01,   -1, 
        0x3f, 0x3e, 0x3d, 0x3c, 0x3b, 0x3a, 0x39, 0x38, 0x37, 0x36, 0x35, 0x34, 0x33, 0x32, 0x31, 0x30, 
        0x2f, 0x2e, 0x2d, 0x2c, 0x2b, 0x2a, 0x29, 0x28, 0x27, 0x26, 0x25, 0x24, 0x23, 0x22, 0x21, 0x20, 
        0x1f, 0x1e, 0x1d, 0x1c, 0x1b, 0x1a, 0x19, 0x18, 0x17, 0x16, 0x15, 0x14, 0x13, 0x12, 0x11, 0x10, 
        0x0f, 0x0e, 0x0d, 0x0c, 0x0b, 0x0a, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01,   -1, 
    ];
    /*
    new Array(1 << colSize);
    var i, j, MSB, start = 1 << 0, end;
    for(i = 0; i < colSize + 1; i++) {
        end = 1 << i; MSB = i;
        
        for(j = start; j < end; j++) {
            this.dropFilter[j] = ~j & ((1 << MSB) - 1);
        }
        start = j;
    }
    
    // for verify
    var s = '', HEXADECIMAL = 16;
    s = '[\n    ';
    for(i = 0; i < this.dropFilter.length;) {
        
        for(j = 0; j < 16; j++) {
            //s += (this.dropFilter[i] ? this.dropFilter[i].toString(HEXADECIMAL) : 'X') + ' ';
            s += (this.dropFilter[i] ? sprintf('0x%02x,', this.dropFilter[i]) : '   X,') + ' ';
            i++;
        }
        s += '\n    '
    }
    s += '];';
    console.log(s);
    //*/
    
    this.nBombBlockInCol = new Array(colSize);
    this.nDropBlockInCol = new Array(colSize);
    this.nBlankBlockInCol = new Array(colSize);
    this.nBlankBlockUnderDropBlockInCol = new Array(colSize);
    this.bitmapBombBlockInCol = new Array(colSize);
    this.bitmapDropBlockInCol = new Array(colSize);
    this.bitmapBombBlock = new Array(rowSize);
    this.bitmapDropBlock = new Array(rowSize);
    //this.bitmapDroppingFinished = new Array(rowSize);
    
    /*
    this.underFilter = Array(1 << colSize);
    var i, end = 1 << colSize, tmp = 0, curPos, cnt, meetOne, lastOnePos;
    for(i = 0; i < end; i++) {
        //if(i == 0) continue;
        cnt = 0; lastPos = 0;
        for(tmp = i; curPos < colSize; tmp = tmp >> 1) {
            if(tmp & 1) {
                if(!meetOne)
                    meetOne = true;
            } else {
                if(meetOne)
                    cnt++;
                    
            }
            curPos++;
        }
        this.countFilter[i] = cnt;
    }
    // for verify
    console.log('\n----------');
    var s = '', HEXADECIMAL = 16;
    s = '[\n';
    for(i = 0; i < this.countFilter.length;) {
        s += '    ';
        for(j = 0; j < 16; j++) {
            //s += (this.dropFilter[i] ? this.countFilter[i].toString(HEXADECIMAL) : 'X') + ' ';
            s += (this.countFilter[i] ? sprintf('%d, ', this.countFilter[i]) : 'X, ');
            i++;
        }
        s += '\n';
    }
    s += ']';
    console.log(s);
    //*/

    this.countFilter = [
        0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 
        1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
        1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
        2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
        1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 
        2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
        2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 
        3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 
    ];
    /*
    Array(1 << colSize);
    var i, end = 1 << colSize, tmp = 0, cnt;
    for(i = 0; i < end; i++) {
        //if(i == 0) continue;
        cnt = 0;
        for(tmp = i; tmp; tmp = tmp >> 1)
            if(tmp & 1) cnt++;
        this.countFilter[i] = cnt;
    }
    // for verify
    console.log('\n----------');
    var s = '', HEXADECIMAL = 16;
    s = '[\n';
    for(i = 0; i < this.countFilter.length;) {
        s += '    ';
        for(j = 0; j < 16; j++) {
            //s += (this.dropFilter[i] ? this.countFilter[i].toString(HEXADECIMAL) : 'X') + ' ';
            s += (this.countFilter[i] ? sprintf('%d, ', this.countFilter[i]) : 'X, ');
            i++;
        }
        s += '\n';
    }
    s += ']';
    console.log(s);
    //*/
    
    this.lastFilter = [ 
        0/* not use */, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 
        4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 
    ];
    //Array(1 << colSize);
    /*
    var i, j, last, start = 1 << 0, end;
    for(i = 1; i <= colSize; i++) {
        end = 1 << i; last = i - 1;
        
        for(j = start; j < end; j++) {
            this.lastFilter[j] = last;
        }
        start = j;
    }
    //*/
    /*
    var i, end = 1 << colSize, tmp = 0, cnt;
    for(i = 0; i < end; i++) {
        if(i == 0) continue;
        cnt = 0;
        for(tmp = i; tmp & 1; tmp = tmp >> 1)
            cnt++;
        this.lastFilter[i] = cnt;
    }
    //*/
    
    /*
    // for verify
    console.log('\n----------');
    var s = '', HEXADECIMAL = 16;
    s = '[\n    ';
    for(i = 0; i < this.lastFilter.length;) {
        
        for(j = 0; j < 16; j++) {
            //s += (this.dropFilter[i] ? this.lastFilter[i].toString(HEXADECIMAL) : 'X') + ' ';
            s += (this.lastFilter[i] ? sprintf('%d, ', this.lastFilter[i]) : 'X, ');
            i++;
        }
        s += '\n    ';
    }
    s += ']';
    console.log(s);
    //*/
    
    // find the last drop block
    this.lastDropBlockInCol = new Array(colSize);
    
    // 
//     this.deltaYInCol = new Array(colSize);
//     this.distanceYInCol = new Array(colSize);
//     this.velocityYInCol = new Array(colSize);
    //this.left = 0, this.top = 0;

    this.reset = function() {
        var row, col;
        
        for(row = 0; row < rowSize; row++) {
            for(col = 0; col < this.nRowSize; col++) {
                this.matrix[row][col].imgIdx = null;
                this.matrix[row][col].status = eBlockStatus.NONE;
            }
        }
    
        for(col = 0; col < colSize; col++) this.nDropBlockInCol_V[col] = 0;
        
        //
        this.deltaX_V = 0, this.velocityX_V = 0;
        for(col = 0; col < rowSize; col++) { this.deltaYInCol_V[col] = 0; }
        for(col = 0; col < rowSize; col++) { this.distanceYInCol_V[col] = 0; }
        for(col = 0; col < rowSize; col++) { this.velocityYInCol_V[col] = 0; }
        
        //
        for(col = 0; col < colSize; col++) this.nBombBlockInCol[col] = 0;
        for(col = 0; col < colSize; col++) this.nDropBlockInCol[col] = 0;
        for(col = 0; col < colSize; col++) this.nBlankBlockInCol[col] = 0;
        for(col = 0; col < colSize; col++) this.nBlankBlockUnderDropBlockInCol[col] = 0;
        for(col = 0; col < colSize; col++) this.bitmapBombBlockInCol[col] = 0;
        for(col = 0; col < colSize; col++) this.bitmapDropBlockInCol[col] = 0;
        for(row = 0; row < rowSize; row++) { this.bitmapBombBlock[row] = 0; }
        for(row = 0; row < rowSize; row++) { this.bitmapDropBlock[row] = 0; }
        //for(row = 0; row < rowSize; row++) { this.bitmapDroppingFinished[row] = 0x7f; }

        //
        for(col = 0; col < rowSize; col++) { this.lastDropBlockInCol[col] = -1; }
        
//         for(col = 0; col < rowSize; col++) { this.deltaYInCol[col] = 0; }
//         for(col = 0; col < rowSize; col++) { this.distanceYInCol[col] = 0; }
//         for(col = 0; col < rowSize; col++) { this.velocityYInCol[col] = 0; }
    }
}

DroppingInfo.prototype = {
}