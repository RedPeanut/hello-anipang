// window can be omitted
/*window.*/mapper = '';
var BROWSER = true;
//var widgetAPI = new Common.API.Widget();
//var tvKey = new Common.API.TVKeyValue();

var Main = {
    onLoad: function() {
        //alert("Main.onLoad()...");
        // Enable key event processing
        this.enableKeys();
        if(!window.BROWSER) widgetAPI.sendReadyEvent();
        
        this.entry();
    },
    onUnload: function() {
    },
    enableKeys: function() {
        if(!window.BROWSER) document.getElementById("anchor").focus();
    }
};

Main.entry = function() {
    //console.log("Main.entry()...");
    
    var game = new Game("HelloAnipang-v0.3", "gameCanvas");
//        loadingToast = document.getElementById('loadingToast'),
//        loadingMessage = document.getElementById('loadingMessage'),
//        loadingToastTitle = document.getElementById('loadingToastTitle'),
//        progressDiv = document.getElementById('progressDiv'),
//        menuToast = document.getElementById('menuToast'),
        // width, height, strokeStyle, (r, g, b))
//        progressbar = new COREHTML5.Progressbar(410, 30, 'rgba(0,0,0,0.5)', 100, 130, 250);
    
    // layout declaration {{{
        
    var OUTER_BOARD_ROUNDING_RADIUS = 
        GAME_BOARD_ROUNDING_RADIUS = 
        SCORE_BOARD_ROUNDING_RADIUS = 
        DESC_BOARD_ROUNDING_RADIUS = BOARD_ROUNDING_RADIUS = 10;
    
    var GRID_MAX = 7;
    
    var CANVAS_W = 940, CANVAS_H = 520,
        // 
        OUTER_BOARD_MARGIN_LEFT = Math.floor(CANVAS_W/6), OUTER_BOARD_MARGIN_TOP = Math.floor(CANVAS_H/15),
        OUTER_BOARD_MARGIN_RIGHT = Math.floor(CANVAS_W/6), OUTER_BOARD_MARGIN_BOTTOM = Math.floor(CANVAS_H/15),
        OUTER_BOARD_X = OUTER_BOARD_MARGIN_LEFT, OUTER_BOARD_Y = OUTER_BOARD_MARGIN_TOP,
        // OUTER_BOARD_W = 671,
        OUTER_BOARD_W = Math.floor(CANVAS_W - OUTER_BOARD_MARGIN_LEFT - OUTER_BOARD_MARGIN_RIGHT),
        // OUTER_BOARD_H = 450, 
        OUTER_BOARD_H = Math.floor(CANVAS_H - OUTER_BOARD_MARGIN_TOP - OUTER_BOARD_MARGIN_BOTTOM),
        OUTER_BOARD_PADDING_LEFT = 30, OUTER_BOARD_PADDING_TOP = 35,
        OUTER_BOARD_PADDING_RIGHT = 10, OUTER_BOARD_PADDING_BOTTOM = 10,
        
        RIGHT_BOARD_PADDING_LEFT = 18, // score, description left padding
        RIGHT_BOARD_PADDING_CENTER = 20, // padding between score, description
    
        // 671 -10 - 10 - 5 = 656
        // 
        //INNER_BOARD_TOT_W = OUTER_BOARD_W - OUTER_BOARD_PADDING_LEFT - OUTER_BOARD_PADDING_RIGHT - RIGHT_BOARD_PADDING_LEFT,
        // 450 - 10 - 10 - 5 = 435
        //INNER_BOARD_TOT_H = OUTER_BOARD_H - OUTER_BOARD_PADDING_TOP - OUTER_BOARD_PADDING_BOTTOM - RIGHT_BOARD_PADDING_CENTER,
        
        // game board xywh
        GAME_BOARD_X = OUTER_BOARD_X + OUTER_BOARD_PADDING_LEFT,
        GAME_BOARD_Y = OUTER_BOARD_Y + OUTER_BOARD_PADDING_TOP,
        // 656 * 5 / 8 = 410
        // for 560
        GAME_BOARD_W = 350, //Math.floor(INNER_BOARD_TOT_W * 5 / 8),
        //GAME_BOARD_W = GAME_BOARD_W - (GAME_BOARD_W % GRID_MAX),
        //GAME_BOARD_H = INNER_BOARD_TOT_H, // = 435
    
        // score board xywh
        //RIGHT_BOARD_TOT_H = INNER_BOARD_TOT_H - RIGHT_BOARD_PADDING_CENTER,
        SCORE_BOARD_X = OUTER_BOARD_X + OUTER_BOARD_PADDING_LEFT + GAME_BOARD_W + RIGHT_BOARD_PADDING_LEFT,
        SCORE_BOARD_Y = OUTER_BOARD_Y + OUTER_BOARD_PADDING_TOP,
        SCORE_BOARD_W = 208, //Math.floor(INNER_BOARD_TOT_W * 3 / 8),
        SCORE_BOARD_H = 125, //Math.floor(INNER_BOARD_TOT_H / 3),
        
        // desc board xywh
        DESC_BOARD_X = SCORE_BOARD_X, 
        DESC_BOARD_Y = OUTER_BOARD_Y + OUTER_BOARD_PADDING_TOP + SCORE_BOARD_H + RIGHT_BOARD_PADDING_CENTER,
        DESC_BOARD_W = SCORE_BOARD_W, 
        DESC_BOARD_H = 250, //Math.floor(INNER_BOARD_TOT_H * 2 / 3);
        
        // timer 
        // x, y is defined in stylesheet in div id='progressBar'
        TIMER_X = OUTER_BOARD_X + 30 + 5, TIMER_Y = OUTER_BOARD_Y + 25,
        TIMER_W = GAME_BOARD_W - 5 * 2, TIMER_H = 30;
        
    // layout declaration }}}
    
    var bShowGrid = true;
    // grid xywh
    var GRID_ROW_MAX = GRID_COL_MAX = GRID_MAX,
        GRID_X = GAME_BOARD_X, GRID_Y = OUTER_BOARD_Y + 85,
        GRID_H = GRID_W = GAME_BOARD_W, // 410
        // for 350
        GRID_COLOR = 'lightgray', GRID_STEP = GRID_W / GRID_MAX;
    //var DROP_ANI_VIEW_AREA_HEIGHT = 
    game.startAnimate = function() {
    };
    
    var COLOR_OUTER_BOARD_BG = 'black',
        COLOR_GAME_BOARD_BG = 'rgb(128, 200, 200)',
        COLOR_GRID_BG = 'black';

    // 
    var RIGHT_BOARD_LINE_ATTR = [ 5, // line width
            undefined, // line cap
            undefined, // line join
            'gray' // line color
        ],
        //RIGHT_BOARD_LINE_COLOR = '#ff9999',
        RIGHT_BOARD_FILL_COLOR = null,
        RIGHT_BOARD_CORNER_RADIUS = 5,
        RIGHT_BOARD_TITLE_FONT_ATTR = [ 'bold 16px arial',
            'left', 'middle', // textAlign, textBaseline
            null, 'white' // stroke color, fill color
        ],
        RIGHT_BOARD_DESC_FONT_ATTR = [ 'bold 16px arial',
            'left', 'middle', // textAlign, textBaseline
            null, 'white' // stroke color, fill color
        ];
    
    var paintOuterBoard = function(context) {
            Util.drawRoundedRect(context,
                null, COLOR_OUTER_BOARD_BG,
                OUTER_BOARD_X, OUTER_BOARD_Y, OUTER_BOARD_W, OUTER_BOARD_H, 
                OUTER_BOARD_ROUNDING_RADIUS);
        }, paintGameBoard = function(context) {
            Util.drawRoundedRect(context,
                null, COLOR_GAME_BOARD_BG,
                GAME_BOARD_X, GAME_BOARD_Y, GAME_BOARD_W, GAME_BOARD_H, 
                GAME_BOARD_ROUNDING_RADIUS);
        }, paintGridBkgr = function(context) {
            Util.drawRoundedRect(context,
                null, COLOR_GRID_BG,
                GRID_X, GRID_Y, GRID_W, GRID_H,
                0);
        }, paintScoreBoard = function(context) {
            Util.drawRoundedTitledRect(context, 
                RIGHT_BOARD_LINE_ATTR, RIGHT_BOARD_FILL_COLOR,
                [SCORE_BOARD_X, SCORE_BOARD_Y, SCORE_BOARD_W, SCORE_BOARD_H],
                RIGHT_BOARD_CORNER_RADIUS,
                RIGHT_BOARD_TITLE_FONT_ATTR, 'Score', 8,
                RIGHT_BOARD_DESC_FONT_ATTR, 'Lorem ipsum');
        }, paintDescBoard = function(context) {
            Util.drawRoundedTitledRect(context, 
                RIGHT_BOARD_LINE_ATTR, RIGHT_BOARD_FILL_COLOR,
                [DESC_BOARD_X, DESC_BOARD_Y, DESC_BOARD_W, DESC_BOARD_H],
                RIGHT_BOARD_CORNER_RADIUS,
                RIGHT_BOARD_TITLE_FONT_ATTR, 'Key Control', 8,
                RIGHT_BOARD_DESC_FONT_ATTR, 'Lorem ipsum');
        };
    
    function drawGrid(context, color, x,y,w,h, stepx, stepy) {
        context.strokeStyle = color;
        context.lineWidth = 0.5;
    
        for(var i = x + 0.5; i < x + w + 1 /* including last line */; i += stepx) {
            context.beginPath();
            context.moveTo(i, y);
            context.lineTo(i, y + h);
            context.stroke();
        }
    
        for(/*var*/ i = y + 0.5; i < y + h + 1; i += stepy) {
            context.beginPath();
            context.moveTo(x, i);
            context.lineTo(x + w, i);
            context.stroke();
        }
    }
    
    game.paintUnderSprites = function() {
        paintOuterBoard(game.context);
        //paintGameBoard();
        //paintGridBkgr();
        paintScoreBoard(game.context);
        paintDescBoard(game.context);
    };
    
    var AXIS_LENGTH_BLOCK_IMAGE = GRID_STEP;
    
    var eGameStatus = { NONE: 0, SELECT: 1, MOVING: 2, BOMBING: 3, DROPPING: 4 };
    var gameStatus = eGameStatus.NONE;
    
    var upperMatrix = new Array(GRID_MAX);
    
    var defaultMatrix = new Array(GRID_MAX),
        defaultBitmapDropping = new Array(GRID_MAX),
        defaultBitmapBombing = new Array(GRID_MAX);
    
    var lowerMatrix = new Array(GRID_MAX);
    //var droppingMatrix = new Array(GRID_MAX);
    var eMovingDirection = { LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3 };
    var eZOrder = { UP: 0, DOWN: 1 };
    var DURATION_MOVING_BLOCK = 0.3, // sec
        VELOCITY_MOVING_BLOCK = AXIS_LENGTH_BLOCK_IMAGE / DURATION_MOVING_BLOCK,
        PPF_MOVING_BLOCK = game.pixelsPerFrame(null/* not used */, VELOCITY_MOVING_BLOCK);
    var movingLowerBlockInfo = {imgIdx: null, row: null, col: null, direction: null, 
        left: 0, top: 0, velocityX: 0, velocityY: 0, deltaX: 0, deltaY: 0},
        movingUpperBlockInfo = {imgIdx: null, row: null, col: null, direction: null, 
        left: 0, top: 0, velocityX: 0, velocityY: 0, deltaX: 0, deltaY: 0};
    var eMovingStatus = { NONE: 0, FORWARD: 1, REVERSE: 2 },
        movingStatus = null;
    var MIN_NUM_OF_BOMB_BLK = 3;
    //var elimination_cnt = 1;
    
    function eliminateAnyBombingBlock(matrix) {
        var row, col, k;
        var cnt = -1;
        
        //console.log('elimination_cnt = ' + elimination_cnt++);
        //if(elimination_cnt > 10)
            //return 0;
        //console.log('entering eliminateAnyBombingBlock()...');
        
        // for debug
        //printMatrix(matrix);
        
        // col(horizontal)
        for(row = 0; row < GRID_MAX; row++) {
            for(col = 0; col <= GRID_MAX - MIN_NUM_OF_BOMB_BLK; col++) {
                var baseIdx = matrix[row][col].imgIdx;
                cnt = 1;
                for(k = col + 1; k < GRID_MAX; k++) {
                    if(matrix[row][k].imgIdx === baseIdx)
                        cnt++;
                    else 
                        break;
                }
                if(cnt >= MIN_NUM_OF_BOMB_BLK) {
                    for(k = col; k < col + cnt; k++)
                        matrix[row][k].status = eBlockStatus.BOMBING;
                }
            }
        }
        
        // row(vertical)
        for(col = 0; col < GRID_MAX; col++) {
            for(row = 0; row <= GRID_MAX - MIN_NUM_OF_BOMB_BLK; row++) {
                var baseIdx = matrix[row][col].imgIdx;
                cnt = 1;
                for(k = row + 1; k < GRID_MAX; k++) {
                    if(matrix[k][col].imgIdx === baseIdx)
                        cnt++;
                    else 
                        break;
                }
                if(cnt >= MIN_NUM_OF_BOMB_BLK) {
                    for(k = row; k < row + cnt; k++)
                        matrix[k][col].status = eBlockStatus.BOMBING;
                }
            }
        }
        
        //printMatrix(matrix);
        
        cnt = 0;
        for(row = 0; row < matrix.length; row++) {
            for(col = 0; col < matrix[row].length; col++) {
                if(matrix[row][col].status === eBlockStatus.BOMBING)
                    cnt++;
            }
        }
        
        //console.log('return ' + cnt);
        return cnt;
    }

    //var eBlockStatus = { NONE: 0, SELECT: 1, MOVING: 2, BOMBING: 3, DROPPING: 4 };
    //var matrix = new Array(GRID_MAX);
    //var droppingMatrix = new Array(GRID_MAX);
    /*
    function Block(imgIdx) {
        this.imgIdx = imgIdx,
        this.status = eBlockStatus.NONE;
        //this.movingInfo = { direction: null, deltaX: null, deltaY: null, zorder: null };
    }
    
    Block.prototype = {
        setImgIdx: function(imgIdx) {
            this.imgIdx = imgIdx;
        },
        setStatus: function(status) {
            this.status = status;
        }
    };
    //*/

    var eliminateVerifyMatrix = [
        [ new Block(3), new Block(3), new Block(5), new Block(5), new Block(2), new Block(6), new Block(2) ],
        [ new Block(3), new Block(4), new Block(6), new Block(2), new Block(0), new Block(4), new Block(6) ],
        [ new Block(2), new Block(4), new Block(1), new Block(6), new Block(2), new Block(2), new Block(0) ],
        [ new Block(5), new Block(2), new Block(3), new Block(5), new Block(4), new Block(3), new Block(1) ],
        [ new Block(1), new Block(1), new Block(3), new Block(5), new Block(5), new Block(0), new Block(5) ],
        [ new Block(1), new Block(2), new Block(1), new Block(4), new Block(5), new Block(6), new Block(1) ],
        [ new Block(1), new Block(1), new Block(5), new Block(3), new Block(4), new Block(5), new Block(6) ],
    ];
    
    function initializeMatrix(gameCtx) {
        var row, col;
        
        for(row = 0; row < defaultMatrix.length; row++) {
            defaultMatrix[row] = new Array(GRID_MAX);
        }
        
        for(row = 0; row < defaultMatrix.length; row++) {
            for(col = 0; col < defaultMatrix[row].length; col++)
                defaultMatrix[row][col] = new Block(Math.floor(Math.random()*GRID_MAX));
        }
        
        ///*
        while(eliminateAnyBombingBlock(defaultMatrix)) {
            for(row = 0; row < defaultMatrix.length; row++) {
                for(col = 0; col < defaultMatrix[row].length; col++)
                    if(defaultMatrix[row][col].getStatus() === eBlockStatus.BOMBING) {
                        defaultMatrix[row][col].setImgIdx(Math.floor(Math.random()*GRID_MAX));
                        defaultMatrix[row][col].setStatus(eBlockStatus.NONE);
                    }
            }
        }
        //*/
        /*
        while(eliminateAnyBombingBlock(eliminateVerifyMatrix)) {
            for(row = 0; row < eliminateVerifyMatrix.length; row++) {
                for(col = 0; col < eliminateVerifyMatrix[row].length; col++)
                    if(eliminateVerifyMatrix[row][col].status === eBlockStatus.BOMBING) {
                        eliminateVerifyMatrix[row][col].setImgIdx(Math.floor(Math.random()*GRID_MAX));
                        eliminateVerifyMatrix[row][col].setStatus(eBlockStatus.NONE);
                    }
            }
        }
        //*/
        //printMatrix(defaultMatrix);
        
//         console.log('is elimination working successfully?');
        
//         for(row = 0; row < droppingMatrix.length; row++) {
//             droppingMatrix[row] = new Array(GRID_MAX);
//         }
        
//         for(row = 0; row < droppingMatrix.length; row++) {
//             for(col = 0; col < droppingMatrix[row].length; col++)
//                 droppingMatrix[row][col] = new Block(null);
//         }
    }
    
    function paintUpperMatrix(context) {
    }
    function paintDefaultMatrix(context) {
        var pImage = game.getImage(URL_BLOCK_IMAGE);
        var row, col;
        
        if(pImage.complete) {
            
            for(row = 0; row < defaultMatrix.length; row++) {
                for(col = 0; col < defaultMatrix[row].length; col++) {
                    
                    var pBlock, pStatus, nImgIdx;
                    
                    pBlock = defaultMatrix[row][col];
                    pStatus = pBlock.status;
                    nImgIdx = pBlock.imgIdx;
                    
                    //pGlobalInfo = globalInfo;
                    
                    if(pStatus === eBlockStatus.MOVING) {
                        
                        // nothing to do
                        //console.log('for break');
                        
                    } else if(pStatus === eBlockStatus.BOMBING) {
                        
                        // nothing do. paintBombingBlock do
                        
                    } else if(pStatus === eBlockStatus.BLANK) {
                        
                        // do not draw
                        
                    } else if(pStatus === eBlockStatus.DROPPING) {
                        
                        
                        
                    } else if(pStatus === eBlockStatus.SELECT) {
                        
                        context.drawImage(pImage, 
                            nImgIdx * AXIS_LENGTH_BLOCK_IMAGE, // src: xywh
                            2 * AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            GRID_X + col * AXIS_LENGTH_BLOCK_IMAGE, // dst: xywh
                            GRID_Y + row * AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE);
                        
                        
                    } else {
                        context.drawImage(pImage, 
                            nImgIdx * AXIS_LENGTH_BLOCK_IMAGE, // src: xywh
                            0,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            GRID_X + col * AXIS_LENGTH_BLOCK_IMAGE, // dst: xywh
                            GRID_Y + row * AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE);
                    }
                }
            }
            
            
            
        } else {
            // not enter here
        }
    }
    function paintLowerMatrix(context) {
    }
    
    // ppf is Pixels Per Frame
    function ppf(velocity) {
        return game.pixelsPerFrame(null/* not use */, velocity);
    }
    
    function paintLowerMovingBlock(context) {
        var pImage = game.getImage(URL_BLOCK_IMAGE);
        
        if(movingLowerBlockInfo.direction === eMovingDirection.LEFT) {
            movingLowerBlockInfo.deltaX -= ppf(VELOCITY_MOVING_BLOCK);
            if(movingLowerBlockInfo.deltaX < -AXIS_LENGTH_BLOCK_IMAGE)
                movingLowerBlockInfo.deltaX = -AXIS_LENGTH_BLOCK_IMAGE;
        } else if(movingLowerBlockInfo.direction === eMovingDirection.RIGHT) {
            movingLowerBlockInfo.deltaX += ppf(VELOCITY_MOVING_BLOCK);
            if(movingLowerBlockInfo.deltaX > AXIS_LENGTH_BLOCK_IMAGE)
                movingLowerBlockInfo.deltaX = AXIS_LENGTH_BLOCK_IMAGE;
        } else if(movingLowerBlockInfo.direction === eMovingDirection.UP) {
            movingLowerBlockInfo.deltaY -= ppf(VELOCITY_MOVING_BLOCK);
            if(movingLowerBlockInfo.deltaY < -AXIS_LENGTH_BLOCK_IMAGE)
                movingLowerBlockInfo.deltaY = -AXIS_LENGTH_BLOCK_IMAGE;
        } else if(movingLowerBlockInfo.direction === eMovingDirection.DOWN) {
            movingLowerBlockInfo.deltaY += ppf(VELOCITY_MOVING_BLOCK);
            if(movingLowerBlockInfo.deltaY > AXIS_LENGTH_BLOCK_IMAGE)
                movingLowerBlockInfo.deltaY = AXIS_LENGTH_BLOCK_IMAGE;
        }
        
        context.drawImage(pImage, 
            movingLowerBlockInfo.imgIdx * AXIS_LENGTH_BLOCK_IMAGE,
            0,
            AXIS_LENGTH_BLOCK_IMAGE,
            AXIS_LENGTH_BLOCK_IMAGE,
            GRID_X + movingLowerBlockInfo.col * AXIS_LENGTH_BLOCK_IMAGE + movingLowerBlockInfo.deltaX,
            GRID_Y + movingLowerBlockInfo.row * AXIS_LENGTH_BLOCK_IMAGE + movingLowerBlockInfo.deltaY,
            AXIS_LENGTH_BLOCK_IMAGE,
            AXIS_LENGTH_BLOCK_IMAGE);
    }
    
    function checkAndMarkAnyBombingBlock(matrix) {
        var row, col, k;
        var cnt = -1;
        
        // col(horizontal)
        for(row = 0; row < GRID_MAX; row++) {
            for(col = 0; col <= GRID_MAX - MIN_NUM_OF_BOMB_BLK; col++) {
                var baseIdx = matrix[row][col].imgIdx;
                cnt = 1;
                for(k = col + 1; k < GRID_MAX; k++) {
                    if(matrix[row][k].imgIdx === baseIdx)
                        cnt++;
                    else 
                        break;
                }
                if(cnt >= MIN_NUM_OF_BOMB_BLK) {
                    for(k = col; k < col + cnt; k++)
                        matrix[row][k].status = eBlockStatus.BOMBING;
                }
            }
        }
        
        // row(vertical)
        for(col = 0; col < GRID_MAX; col++) {
            for(row = 0; row <= GRID_MAX - MIN_NUM_OF_BOMB_BLK; row++) {
                var baseIdx = matrix[row][col].imgIdx;
                cnt = 1;
                for(k = row + 1; k < GRID_MAX; k++) {
                    if(matrix[k][col].imgIdx === baseIdx)
                        cnt++;
                    else 
                        break;
                }
                if(cnt >= MIN_NUM_OF_BOMB_BLK) {
                    for(k = row; k < row + cnt; k++)
                        matrix[k][col].status = eBlockStatus.BOMBING;
                }
            }
        }
        
        //printMatrix(matrix);
        
        cnt = 0;
        for(row = 0; row < matrix.length; row++) {
            for(col = 0; col < matrix[row].length; col++) {
                if(matrix[row][col].status === eBlockStatus.BOMBING)
                    cnt++;
            }
        }
        
        //console.log('return ' + cnt);
        return cnt;
    }
    
    var BINARY = 2, OCTAL = 8, HEXADECIMAL = 16;
    
    function prepareDropping() {
        var row, col, k, tmp;
        var pMatrix, pColArray, pBlock;
        var s, d; // for debug
        
        // 
        for(row = 0; row < defaultMatrix.length; row++) {
            for(col = 0; col < defaultMatrix[row].length; col++) {
                if(defaultMatrix[row][col].status === eBlockStatus.BOMBING) {
                    defaultMatrix[row][col].status = eBlockStatus.BLANK;
                    
                    //droppingInfo.nBombBlockInCol[col]++;
                    droppingInfo.nBlankBlockInCol[col]++;
                    droppingInfo.bitmapBombBlock[row] |= 1 << col;
                    
                    // mark bomb
                    droppingInfo.bitmapBombBlockInCol[col] |= 1 << row;
                }
            }
        }
        
//         // for debug
//         console.log('----------');
//         s = 'bitmapBombBlockInCol = [ ';
//         for(col = 0; col < droppingInfo.bitmapBombBlockInCol.length; col++)
//             s += sprintf('0x%02x,', droppingInfo.bitmapBombBlockInCol[col]) + ' ';
//         s += ']';
//         console.log(s);
        
//         console.log('nBlankBlockInCol = [ ' + droppingInfo.nBlankBlockInCol + ' ]');

//         s = 'bitmapBombBlock = [ ';
//         for(row = 0; row < droppingInfo.bitmapBombBlock.length; row++)
//             s += sprintf('0x%02x,', droppingInfo.bitmapBombBlock[row]) + ' ';
//         s +=']';
//         console.log(s);
        
        ///*
        for(col = 0; col < GRID_MAX; col++) {
            // dropFilter returns drop block bitmap from bomb block bitmap
            // ex) dropFilter[0001010(=10)] = 0000101(=5)
            droppingInfo.bitmapDropBlockInCol[col] = droppingInfo.dropFilter[droppingInfo.bitmapBombBlockInCol[col]];
            if(droppingInfo.bitmapDropBlockInCol[col] != -1) {
                for(row = 0; row < GRID_MAX; row++) {
                    if(droppingInfo.bitmapDropBlockInCol[col] & (1 << row)) {
                        var pBlock = defaultMatrix[row][col];
                        pBlock.status = eBlockStatus.DROPPING;
                        // countFilter returns number of bit from bitmap
                        // ex) countFilter[0010101] = 3
                        pBlock.nBlankBlockUnderMe = droppingInfo.countFilter[droppingInfo.bitmapBombBlockInCol[col] >> row];
                        pBlock.droppingDistanceY = pBlock.nBlankBlockUnderMe * GRID_STEP;
                        pBlock.droppingVelocityY = pBlock.droppingDistanceY / DROP_ANI_DURATION;
                        droppingInfo.nDropBlockInCol[col]++;
                    }
                }
                droppingInfo.lastDropBlockInCol[col] = droppingInfo.lastFilter[droppingInfo.bitmapDropBlockInCol[col]];
            }
        }
        
        printMatrix(defaultMatrix);
        console.log('=== For nBlankBlockUnderMe ===');
        pMatrix = defaultMatrix;
        d = '';
        for(row = 0; row < pMatrix.length; row++) {
            s = '';
            for(col = 0; col < pMatrix[row].length; col++) {
                pBlock = pMatrix[row][col];
                if(pBlock.status === eBlockStatus.BOMBING)
                    s += 'B ';
                else if(pBlock.status === eBlockStatus.DROPPING) {
                    s += pBlock.nBlankBlockUnderMe + ' ';
                    d += '[' + row + ']' + '[' + col + ']' + ' distaceY = ' + pBlock.droppingDistanceY + ', velocityY = ' + pBlock.droppingVelocityY + '\n';
                } else if(pBlock.status === eBlockStatus.BLANK) {
                    s += '- ';
                } else
                    s += 'N ';
            }
            console.log(s);
        }
        console.log(d);
//         // for debug
//         console.log('----------');
//         s = 'bitmapDropBlockInCol = [ ';
//         for(col = 0; col < droppingInfo.bitmapDropBlockInCol.length; col++) {
//             if(droppingInfo.bitmapDropBlockInCol[col] == -1)
//                 s += droppingInfo.bitmapDropBlockInCol[col] + ' ';
//             else
//                 s += sprintf('0x%02x,', droppingInfo.bitmapDropBlockInCol[col]) + ' ';
//         }
//         s += ']';
//         console.log(s);
        
//         //printMatrix(defaultMatrix);
//         console.log('----------');
//         console.log('lastDropBlockInCol = ' + droppingInfo.lastDropBlockInCol);
        
        // make virtual matrix that fill blank block
        pMatrix = droppingInfo.matrix;
        pColArray = droppingInfo.nBlankBlockInCol;
        
        for(col = 0; col < GRID_MAX; col++) {
            for(cnt = 0; cnt < pColArray[col]; cnt++) {
                pMatrix[GRID_MAX - 1 - cnt][col].status = eBlockStatus.DROPPING;
                pMatrix[GRID_MAX - 1 - cnt][col].imgIdx = Math.floor(Math.random()*GRID_MAX);
                droppingInfo.nDropBlockInCol_V[col]++;
            }
        }
        
        // for debug
        //paintMatrix(pMatrix);
//         console.log('----------');
//         for(row = 0; row < pMatrix.length; row++) {
//             var s = '';
//             for(col = 0; col < pMatrix[row].length; col++) {
//                 if(pMatrix[row][col].status === eBlockStatus.DROPPING)
//                     s += pMatrix[row][col].imgIdx + ' ';
//                 else
//                     s += '- ';
//             }
//             console.log(s);
//         }
        //*/
        
        // calculate velocityY for dropping block
        for(col = 0; col < GRID_MAX; col++) {
//             droppingInfo.distanceYInCol[col] = droppingInfo.nBlankBlockInCol[col] * GRID_STEP;
//             droppingInfo.velocityYInCol[col] = droppingInfo.nBlankBlockInCol[col] * GRID_STEP / DROP_ANI_DURATION;
            droppingInfo.distanceYInCol_V[col] = droppingInfo.nBlankBlockInCol[col] * GRID_STEP + DROP_ANI_VIEW_AREA_HEIGHT;
            droppingInfo.velocityYInCol_V[col] = (droppingInfo.nBlankBlockInCol[col] * GRID_STEP + DROP_ANI_VIEW_AREA_HEIGHT) / DROP_ANI_DURATION;
        }
        
        // 
        
    }
    
    function startDropping() {
        gameStatus = eGameStatus.DROPPING;
    }
    
    function startBombing() {
        globalInfo.lastTime = getTimeNow();
        globalInfo.bombIdx = 1;
        gameStatus = eGameStatus.BOMBING;
    }
    
    function swtchMovingBlock() {
        // before switching, update defaultMatrix
        defaultMatrix[movingLowerBlockInfo.row][movingLowerBlockInfo.col].imgIdx = movingUpperBlockInfo.imgIdx;
        defaultMatrix[movingUpperBlockInfo.row][movingUpperBlockInfo.col].imgIdx = movingLowerBlockInfo.imgIdx;

        // update index
        switch(movingLowerBlockInfo.direction) {
            case eMovingDirection.LEFT: movingLowerBlockInfo.col -= 1; break;
            case eMovingDirection.RIGHT: movingLowerBlockInfo.col += 1; break;
            case eMovingDirection.UP: movingLowerBlockInfo.row -= 1; break;
            case eMovingDirection.DOWN: movingLowerBlockInfo.row += 1; break;
        }
        
        // change direction
        switch(movingLowerBlockInfo.direction) {
            case eMovingDirection.LEFT: movingLowerBlockInfo.direction = eMovingDirection.RIGHT; break;
            case eMovingDirection.RIGHT: movingLowerBlockInfo.direction = eMovingDirection.LEFT; break;
            case eMovingDirection.UP: movingLowerBlockInfo.direction = eMovingDirection.DOWN; break;
            case eMovingDirection.DOWN: movingLowerBlockInfo.direction = eMovingDirection.UP; break;
        }
        
        // reset delta
        movingLowerBlockInfo.deltaX = 0; movingLowerBlockInfo.deltaY = 0;
        
        // update index
        switch(movingUpperBlockInfo.direction) {
            case eMovingDirection.LEFT: movingUpperBlockInfo.col -= 1; break;
            case eMovingDirection.RIGHT: movingUpperBlockInfo.col += 1; break;
            case eMovingDirection.UP: movingUpperBlockInfo.row -= 1; break;
            case eMovingDirection.DOWN: movingUpperBlockInfo.row += 1; break;
        }
        
        // change direction
        switch(movingUpperBlockInfo.direction) {
            case eMovingDirection.LEFT: movingUpperBlockInfo.direction = eMovingDirection.RIGHT; break;
            case eMovingDirection.RIGHT: movingUpperBlockInfo.direction = eMovingDirection.LEFT; break;
            case eMovingDirection.UP: movingUpperBlockInfo.direction = eMovingDirection.DOWN; break;
            case eMovingDirection.DOWN: movingUpperBlockInfo.direction = eMovingDirection.UP; break;
        }
        
        // reset delta
        movingUpperBlockInfo.deltaX = 0; movingUpperBlockInfo.deltaY = 0;

        // around here, we should check there is any bombing
        if(checkAndMarkAnyBombingBlock(defaultMatrix) > 0) {
            
            // remove MOVING status for moving block if not bombing
            // means that change to stop(none) status
            if(defaultMatrix[movingUpperBlockInfo.row][movingUpperBlockInfo.col].status === eBlockStatus.MOVING)
                defaultMatrix[movingUpperBlockInfo.row][movingUpperBlockInfo.col].status = eBlockStatus.NONE;
            if(defaultMatrix[movingLowerBlockInfo.row][movingLowerBlockInfo.col].status === eBlockStatus.MOVING)
                defaultMatrix[movingLowerBlockInfo.row][movingLowerBlockInfo.col].status = eBlockStatus.NONE;
            
            startBombing();
            
            return;
        }
        
        // exchange block info
        var tmp = movingUpperBlockInfo;
        movingUpperBlockInfo = movingLowerBlockInfo;
        movingLowerBlockInfo = tmp;
    }
    
    function endMovingBlock() {
        defaultMatrix[movingLowerBlockInfo.row][movingLowerBlockInfo.col].imgIdx = movingUpperBlockInfo.imgIdx;
        defaultMatrix[movingUpperBlockInfo.row][movingUpperBlockInfo.col].imgIdx = movingLowerBlockInfo.imgIdx;
        defaultMatrix[movingLowerBlockInfo.row][movingLowerBlockInfo.col].status = eBlockStatus.NONE;
        defaultMatrix[movingUpperBlockInfo.row][movingUpperBlockInfo.col].status = eBlockStatus.NONE;
    }
    
    function paintUpperMovingBlock(context) {
        var pImage = game.getImage(URL_BLOCK_IMAGE);
        var bForceSwtch = false;
        
        if(movingUpperBlockInfo.direction === eMovingDirection.LEFT) {
            movingUpperBlockInfo.deltaX -= ppf(VELOCITY_MOVING_BLOCK);
            
            if(movingUpperBlockInfo.deltaX < -AXIS_LENGTH_BLOCK_IMAGE) {
                movingUpperBlockInfo.deltaX = -AXIS_LENGTH_BLOCK_IMAGE;
                bForceSwtch = true;
            }
        } else if(movingUpperBlockInfo.direction === eMovingDirection.RIGHT) {
            movingUpperBlockInfo.deltaX += ppf(VELOCITY_MOVING_BLOCK);
            if(movingUpperBlockInfo.deltaX > AXIS_LENGTH_BLOCK_IMAGE) {
                movingUpperBlockInfo.deltaX = AXIS_LENGTH_BLOCK_IMAGE;
                bForceSwtch = true;
            }
        } else if(movingUpperBlockInfo.direction === eMovingDirection.UP) {
            movingUpperBlockInfo.deltaY -= ppf(VELOCITY_MOVING_BLOCK);
            if(movingUpperBlockInfo.deltaY < -AXIS_LENGTH_BLOCK_IMAGE) {
                movingUpperBlockInfo.deltaY = -AXIS_LENGTH_BLOCK_IMAGE;
                bForceSwtch = true;
            }
        } else if(movingUpperBlockInfo.direction === eMovingDirection.DOWN) {
            movingUpperBlockInfo.deltaY += ppf(VELOCITY_MOVING_BLOCK);
            if(movingUpperBlockInfo.deltaY > AXIS_LENGTH_BLOCK_IMAGE) {
                movingUpperBlockInfo.deltaY = AXIS_LENGTH_BLOCK_IMAGE;
                bForceSwtch = true;
            }
        }
        
        context.drawImage(pImage, 
            movingUpperBlockInfo.imgIdx * AXIS_LENGTH_BLOCK_IMAGE,
            0,
            AXIS_LENGTH_BLOCK_IMAGE,
            AXIS_LENGTH_BLOCK_IMAGE,
            GRID_X + movingUpperBlockInfo.col * AXIS_LENGTH_BLOCK_IMAGE + movingUpperBlockInfo.deltaX,
            GRID_Y + movingUpperBlockInfo.row * AXIS_LENGTH_BLOCK_IMAGE + movingUpperBlockInfo.deltaY,
            AXIS_LENGTH_BLOCK_IMAGE,
            AXIS_LENGTH_BLOCK_IMAGE);
        
        if(bForceSwtch) {
            if(movingStatus === eMovingStatus.FORWARD) {
                movingStatus = eMovingStatus.REVERSE;
                swtchMovingBlock();
            } else if(movingStatus === eMovingStatus.REVERSE) {
                endMovingBlock();
                movingStatus = eMovingStatus.NONE;
                // release selection
                gameStatus = eGameStatus.NONE;
            }
        }
    }
    
    function paintPreDroppingBlock(context) {
        
    }
    
    function paintBombingBlock(context) {
        // for bomb effect fps change
        var row, col;
        var pGlobalInfo = globalInfo;
        var pImage = game.getImage(URL_BLOCK_IMAGE);
        var nowTime = getTimeNow();
        var pb;
        
        //++pBlock.nShowedFrame;
        pGlobalInfo.elapsedTime = nowTime - pGlobalInfo.lastTime;
        if(pGlobalInfo.elapsedTime > BOMB_ANI_DPF*1000) {
            ++pGlobalInfo.bombIdx;
            // reset
            pGlobalInfo.elapsedTime = 0;
            pGlobalInfo.lastTime = nowTime;
        }
        
        for(row = 0; row < defaultMatrix.length; row++) {
            for(col = 0; col < defaultMatrix[row].length; col++) {
                
                if(defaultMatrix[row][col].status === eBlockStatus.BOMBING) {
                    context.drawImage(pImage, 
                        defaultMatrix[row][col].imgIdx * AXIS_LENGTH_BLOCK_IMAGE, // src: xywh
                        pGlobalInfo.bombIdx * AXIS_LENGTH_BLOCK_IMAGE,
                        AXIS_LENGTH_BLOCK_IMAGE,
                        AXIS_LENGTH_BLOCK_IMAGE,
                        GRID_X + col * AXIS_LENGTH_BLOCK_IMAGE, // dst: xywh
                        GRID_Y + row * AXIS_LENGTH_BLOCK_IMAGE,
                        AXIS_LENGTH_BLOCK_IMAGE,
                        AXIS_LENGTH_BLOCK_IMAGE);
                }
            }
        }
        
        if(pGlobalInfo.bombIdx >= BOMB_ANI_N_FRAME) {
            // 
            droppingInfo.reset();
            // reset block dropping info
            for(row = 0; row < defaultMatrix.length; row++) {
                for(col = 0; col < defaultMatrix.length; col++) {
                    pb = defaultMatrix[row][col];
                    pb.resetDroppingInfo();
                }
            }
            prepareDropping();
            paintPreDroppingBlock(context);
            startDropping();
        }
    }

    // for debugging
    function printMatrix(pMatrix) {
        console.log('----------');
        for(row = 0; row < pMatrix.length; row++) {
            s = '';
            for(col = 0; col < pMatrix[row].length; col++) {
                if(pMatrix[row][col].status === eBlockStatus.BOMBING)
                    s += 'B ';
                else if(pMatrix[row][col].status === eBlockStatus.DROPPING)
                    s += 'D ';
                else if(pMatrix[row][col].status === eBlockStatus.BLANK)
                    s += '- ';
                else
                    s += pMatrix[row][col].imgIdx + ' ';
            }
            console.log(s);
        }
    }

    function updateDefaultMatrixWithDroppingInfo() {
        var row, col, k;
        var pb;
        var pd = droppingInfo;
        
        //console.log('updateDefaultMatrixWithDroppingInfo()...');
        // for debug
//         console.log('----------')
//         console.log('droppingInfo.nDropBlockInCol = ' + pd.nDropBlockInCol);
//         console.log('droppingInfo.nBlankBlockInCol = ' + pd.nBlankBlockInCol);
//         printMatrix(defaultMatrix);
        
        for(col = 0; col < GRID_MAX; col++) {
            if(pd.nDropBlockInCol[col] > 0) {
                //var pBlock;
                for(row = GRID_MAX - 1; row >= 0; row--) {
                    pb = defaultMatrix[row][col];
                    if(defaultMatrix[row][col].status === eBlockStatus.DROPPING) {
                        pb.status = eBlockStatus.NONE;
                        
                        defaultMatrix[row+pd.nBlankBlockInCol[col]][col].copy(pb);
                    }
                }
            }
            if(pd.nBlankBlockInCol[col] > 0) {
                //var pBlock;
                for(row = 0; row < GRID_MAX; row++) {
                    pb = pd.matrix[row][col];
                    if(pb.status === eBlockStatus.DROPPING) {
                        for(k = 0; k < pd.nBlankBlockInCol[col]; k++) {
                            pb = pd.matrix[row+k][col];
                            pb.status = eBlockStatus.NONE;
                            defaultMatrix[0+k][col].copy(pb);
                        }
                    }
                }
            }
        }
        
        //printMatrix(defaultMatrix);
    }
    
    var VIRT_GRID_Y = GRID_Y - GRID_H - DROP_ANI_VIEW_AREA_HEIGHT;
    function paintDroppingBlock(context) {
        
        var row, col;
        var pImage = game.getImage(URL_BLOCK_IMAGE);
        var pBlock;
        var bDefaultMatrixDroppingFinished = false,
            bVertMatrixDroppingFinished = false,
            bitmapDroppingFinishedInCol,
            bitmapDroppingFinishedInRow;
        //var s; // for debug
        
        context.save();
        
        context.beginPath();
        context.moveTo(GRID_X, GRID_Y - DROP_ANI_VIEW_AREA_HEIGHT);
        context.lineTo(GRID_X + GRID_W, GRID_Y - DROP_ANI_VIEW_AREA_HEIGHT);
        context.lineTo(GRID_X + GRID_W, GRID_Y + GRID_H);
        context.lineTo(GRID_X, GRID_Y + GRID_H);
        context.lineTo(GRID_X, GRID_Y - DROP_ANI_VIEW_AREA_HEIGHT);
        context.clip();
        
        bitmapDroppingFinishedInCol = 0x7f;
        
        s = '';
        for(col = 0; col < GRID_MAX; col++) {
            
            //bitmapDroppingFinishedInCol = 0x7f;
            //
            if(droppingInfo.nDropBlockInCol[col] > 0) {
                
//                 droppingInfo.deltaYInCol[col] += ppf(droppingInfo.velocityYInCol[col]);
//                 if(droppingInfo.deltaYInCol[col] > droppingInfo.distanceYInCol[col]) {
//                     droppingInfo.deltaYInCol[col] = droppingInfo.distanceYInCol[col];
//                     // finish dropping
//                     bDefaultMatrixDroppingFinished = true;
//                 }
                //bitmapDroppingFinishedInCol &= droppingInfo.bitmapDropBlockInCol[col]
                
                bitmapDroppingFinishedInRow = 0x7f;
                for(row = 0; row < GRID_MAX; row++) {
                    
                    pBlock = defaultMatrix[row][col];
                    
                    if(defaultMatrix[row][col].status === eBlockStatus.DROPPING) {
                        
                        pBlock.droppingDeltaY += ppf(pBlock.droppingVelocityY);
                        if(pBlock.droppingDeltaY > pBlock.droppingDistanceY) {
                            pBlock.droppingDeltaY = pBlock.droppingDistanceY;
                            bitmapDroppingFinishedInRow ^= 1 << row;
                        } else {
                            //bDefaultMatrixDroppingFinished = false;
                            //s += '[' + row + ']' + '[' + col + '].deltaY = ' + pBlock.droppingDeltaY + '\n';
                        }
                        
                        context.drawImage(pImage, 
                            pBlock.imgIdx * AXIS_LENGTH_BLOCK_IMAGE,
                            0,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            GRID_X + col * AXIS_LENGTH_BLOCK_IMAGE,
                            GRID_Y + row * AXIS_LENGTH_BLOCK_IMAGE + pBlock.droppingDeltaY,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            AXIS_LENGTH_BLOCK_IMAGE);
                    } else {
                        bitmapDroppingFinishedInRow ^= 1 << row;
                    }
                }
                
                if(!bitmapDroppingFinishedInRow)
                    bitmapDroppingFinishedInCol ^= 1 << col;
                    
            } else {
                //bDefaultMatrixDroppingFinished = true;
                bitmapDroppingFinishedInCol ^= 1 << col;
            }
            
            
            // draw top virtual matrix dropping block
            if(droppingInfo.nBlankBlockInCol[col] > 0) {
                droppingInfo.deltaYInCol_V[col] += ppf(droppingInfo.velocityYInCol_V[col]);
                if(droppingInfo.deltaYInCol_V[col] > droppingInfo.distanceYInCol_V[col]) {
                    droppingInfo.deltaYInCol_V[col] = droppingInfo.distanceYInCol_V[col];
                    // finish dropping
                    bVertMatrixDroppingFinished = true;
                }
                
                var pBlock;
                for(row = 0; row < GRID_MAX; row++) {
                    
                    pBlock = droppingInfo.matrix[row][col];
                    
                    if(pBlock.status === eBlockStatus.DROPPING) {
                        
                        var dst_y = VIRT_GRID_Y + row * AXIS_LENGTH_BLOCK_IMAGE + droppingInfo.deltaYInCol_V[col];
                        var dst_h = AXIS_LENGTH_BLOCK_IMAGE;
                        var dst_b = dst_y + AXIS_LENGTH_BLOCK_IMAGE;
                        var src_y = 0, src_h = AXIS_LENGTH_BLOCK_IMAGE;
                        if(dst_b < 0) continue;
                        if(dst_y < 0) { 
                            src_y = -dst_y; src_h = dst_b; 
                            dst_y = 0; dst_h = dst_b - dst_y; 
                        }
                        
                        context.drawImage(pImage, 
                            pBlock.imgIdx * AXIS_LENGTH_BLOCK_IMAGE,
                            src_y,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            src_h,
                            GRID_X + col * AXIS_LENGTH_BLOCK_IMAGE,
                            dst_y,
                            AXIS_LENGTH_BLOCK_IMAGE,
                            dst_h);
                    }
                }  
            }
        }
        
        //console.log(s);
        
        if(!bitmapDroppingFinishedInCol)
            bDefaultMatrixDroppingFinished = true;
        
        if(bDefaultMatrixDroppingFinished && bVertMatrixDroppingFinished) {
                // dropping animation is finished
                // update default matrix
                // check any bombing block again
                
                updateDefaultMatrixWithDroppingInfo();
                if(checkAndMarkAnyBombingBlock(defaultMatrix) > 0) {
                    // start bombing again
                    startBombing();
                } else {
                    // back to normal status
                    gameStatus = eGameStatus.NONE;
                }
            }
        
        context.restore();
    }
    
    function paintMatrix(context) {
//         if(gameStatus === eGameStatus.MOVING) paintLowerMatrix(context);
        if(gameStatus === eGameStatus.MOVING) paintLowerMovingBlock(context);
        if(true) paintDefaultMatrix(context);
        if(gameStatus === eGameStatus.BOMBING) paintBombingBlock(context);
        if(gameStatus === eGameStatus.DROPPING) paintDroppingBlock(context);
        if(gameStatus === eGameStatus.MOVING) paintUpperMovingBlock(context);
//         if(gameStatus === eGameStatus.MOVING) paintUpperMatrix(context);
    }
    
    function paintSelect(context) {
        Util.drawRoundedCorner(context, 
            SELECT_LINE_STYLE, 
            gameStatus === eGameStatus.NONE ? SELECT_DEFAULT_COLOR : SELECT_PRESS_COLOR,
            null,
            GRID_X + selectPosCol * GRID_STEP, GRID_Y + selectPosRow * GRID_STEP,
            GRID_STEP, GRID_STEP,
            SELECT_CORNER_RADIUS, SELECT_CORNER_LEN);
    }
    
    var fps = engineDefinitions.DESIRED_FPS;
    var lastTime = 0;
    
    if(globalDefinitions.DEBUG) {
        function paintFPS(context) {
            context.save();
            context.fillStyle = 'gray';
            context.font = 'bold 15px arial',
            //context.textAlign = this.textAlign,
            //context.textBaseline = this.textBaseline;
            context.fillText(sprintf('current fps = %.2f', fps), 10, 25);
            context.restore();
        }
        
        function updateFPS() {
            //console.log(this);
            var nowTime = getTimeNow();
            var elapsedTime = nowTime - lastTime;
            
            if(nowTime - lastTime > 300) {
                fps = game.fps;
                lastTime = nowTime;
            }
        }
    }
    
    function paintTimer(context) {
        var pt = timerInfo;
        var nowTime = getTimeNow();
        var elapsedTime = nowTime - pt.lastTime;
        if(nowTime - pt.lastTime > 1000) {
            if(--pt.elapsedTime > 0) {
                pt.progressBar.drawDegreeToBuffer(pt.elapsedTime);
            } else {
                pt.progressBar.drawDegreeToBuffer(0);
            }
            pt.progressBar.draw();
            pt.lastTime = nowTime;
            //if(globalDefinitions.DEBUG) updateFPS();
        }
    }
    
    game.paintOverSprites = function() {
        paintMatrix(game.context);
        paintTimer(game.context);
        if(globalDefinitions.DEBUG) {
            updateFPS();
            paintFPS(game.context);
        }
        if(bShowGrid) {
            drawGrid(game.context, GRID_COLOR, 
                GRID_X, GRID_Y, GRID_W, GRID_H,
                GRID_STEP, GRID_STEP);
        }
        paintSelect(game.context);
    };
    
    var URL_BLOCK_IMAGE = 'images/block.png';
    
    var DEFAULT_SELECT_POS_ROW = 3, DEFAULT_SELECT_POS_COL = 3;
    var selectPosRow = DEFAULT_SELECT_POS_ROW, selectPosCol = DEFAULT_SELECT_POS_COL;
    var eSceneStatus = { MENU_S: 0, GAME_S:1 };
    var sceneStatus = eSceneStatus.GAME_S;
    //var selectStatus = false;

    function menuKeyHandlerkeyCode(keyCode) {
    }
    
    function gameKeyHandler(keyCode) {
        
        if(keyCode === 'left arrow' || keyCode === 'right arrow'
            || keyCode === 'up arrow' || keyCode === 'down arrow') {
            
            if(gameStatus === eGameStatus.SELECT) {
                
                // move & judge
                // if(is_movable())
                //     prepare_moving();
                // else
                //     nothing_to_do();
                
                if(keyCode === 'left arrow') {
                    if(selectPosCol - 1 < 0)
                        return;
//                     defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.MOVING;
//                     movingUpperBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol].imgIdx;
//                     movingUpperBlockInfo.row = selectPosRow; movingUpperBlockInfo.col = selectPosCol;
//                     movingUpperBlockInfo.deltaX = 0; movingUpperBlockInfo.deltaY = 0;
                    movingUpperBlockInfo.direction = eMovingDirection.LEFT;
                    
                    defaultMatrix[selectPosRow][selectPosCol - 1].status = eBlockStatus.MOVING;
                    movingLowerBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol - 1].imgIdx;
                    movingLowerBlockInfo.row = selectPosRow; movingLowerBlockInfo.col = selectPosCol - 1;
//                     movingLowerBlockInfo.deltaX = 0; movingLowerBlockInfo.deltaY = 0;
                    movingLowerBlockInfo.direction = eMovingDirection.RIGHT;
                } else if(keyCode === 'right arrow') {
                    if(selectPosCol + 1 > GRID_MAX - 1) 
                        return;
//                     defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.MOVING;
//                     movingUpperBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol].imgIdx;
//                     movingUpperBlockInfo.row = selectPosRow; movingUpperBlockInfo.col = selectPosCol;
//                     movingUpperBlockInfo.deltaX = 0; movingUpperBlockInfo.deltaY = 0;
                    movingUpperBlockInfo.direction = eMovingDirection.RIGHT;
                    
                    defaultMatrix[selectPosRow][selectPosCol + 1].status = eBlockStatus.MOVING;
                    movingLowerBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol + 1].imgIdx;
                    movingLowerBlockInfo.row = selectPosRow; movingLowerBlockInfo.col = selectPosCol + 1;
//                     movingLowerBlockInfo.deltaX = 0; movingLowerBlockInfo.deltaY = 0;
                    movingLowerBlockInfo.direction = eMovingDirection.LEFT;
                } else if(keyCode === 'up arrow') {
                    if(selectPosRow - 1 < 0) 
                        return;
//                     defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.MOVING;
//                     movingUpperBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol].imgIdx;
//                     movingUpperBlockInfo.row = selectPosRow; movingUpperBlockInfo.col = selectPosCol;
//                     movingUpperBlockInfo.deltaX = 0; movingUpperBlockInfo.deltaY = 0;
                    movingUpperBlockInfo.direction = eMovingDirection.UP;
                    
                    defaultMatrix[selectPosRow - 1][selectPosCol].status = eBlockStatus.MOVING;
                    movingLowerBlockInfo.imgIdx = defaultMatrix[selectPosRow - 1][selectPosCol].imgIdx;
                    movingLowerBlockInfo.row = selectPosRow - 1; movingLowerBlockInfo.col = selectPosCol;
//                     movingLowerBlockInfo.deltaX = 0; movingLowerBlockInfo.deltaY = 0;
                    movingLowerBlockInfo.direction = eMovingDirection.DOWN;
                } else if(keyCode === 'down arrow') {
                    if(selectPosRow + 1 > GRID_MAX - 1) 
                        return;
//                     defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.MOVING;
//                     movingUpperBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol].imgIdx;
//                     movingUpperBlockInfo.row = selectPosRow; movingUpperBlockInfo.col = selectPosCol;
//                     movingUpperBlockInfo.deltaX = 0; movingUpperBlockInfo.deltaY = 0;
                    movingUpperBlockInfo.direction = eMovingDirection.DOWN;
                    
                    defaultMatrix[selectPosRow + 1][selectPosCol].status = eBlockStatus.MOVING;
                    movingLowerBlockInfo.imgIdx = defaultMatrix[selectPosRow + 1][selectPosCol].imgIdx;
                    movingLowerBlockInfo.row = selectPosRow + 1; movingLowerBlockInfo.col = selectPosCol;
//                     movingLowerBlockInfo.deltaX = 0; movingLowerBlockInfo.deltaY = 0;
                    movingLowerBlockInfo.direction = eMovingDirection.UP;
                }
                
                // common
                defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.MOVING;
                movingUpperBlockInfo.imgIdx = defaultMatrix[selectPosRow][selectPosCol].imgIdx;
                movingUpperBlockInfo.row = selectPosRow; movingUpperBlockInfo.col = selectPosCol;
                movingUpperBlockInfo.deltaY = 0; movingUpperBlockInfo.deltaX = 0;
                
                movingLowerBlockInfo.deltaY = 0; movingLowerBlockInfo.deltaX = 0;
                
                gameStatus = eGameStatus.MOVING;
                movingStatus = eMovingStatus.FORWARD;
            } else if(gameStatus == eGameStatus.NONE) {
                if(keyCode === 'left arrow') {
                    selectPosCol--;
                    if(selectPosCol < 0) 
                        selectPosCol = 0;
                } else if(keyCode === 'right arrow') {
                    selectPosCol++;
                    if(selectPosCol > GRID_MAX - 1) 
                        selectPosCol = GRID_MAX - 1;
                } else if(keyCode === 'up arrow') {
                    selectPosRow--;
                    if(selectPosRow < 0) 
                        selectPosRow = 0;
                } else if(keyCode === 'down arrow') {
                    selectPosRow++;
                    if(selectPosRow > GRID_MAX - 1) 
                        selectPosRow = GRID_MAX - 1;
                }
            }
            
        } else if(keyCode === 'space') {
            if(gameStatus === eGameStatus.SELECT) {
                gameStatus = eGameStatus.NONE;
                
                defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.NONE;
                
            } else if(gameStatus === eGameStatus.NONE) {
                gameStatus = eGameStatus.SELECT;
                
                defaultMatrix[selectPosRow][selectPosCol].status = eBlockStatus.SELECT;
            }
        } else if(keyCode === 'g') {
            bShowGrid = !bShowGrid;
        }
        
        /* string case is not working in javascript
        switch(keyCode) {
            'left arrow': 
                selectPosCol--;
                if(selectPosCol < 0) 
                    selectPosCol = 0;
                break;
            'right arrow': 
                selectPosCol++;
                if(selectPosCol > GRID_MAX) 
                    selectPosCol = GRID_MAX;
                break;
            'up arrow':
                selectPosRow--;
                if(selectPosRow < 0) 
                    selectPosRow = 0;
                break;
            'down arrow':
                selectPosRow++;
                if(selectPosRow > GRID_MAX) 
                    selectPosRow = GRID_MAX;
                break;

            default: break;
        }
        //*/
    }
    
    function sceneKeyHandler(keyCode) {
        switch(sceneStatus) {
            case eSceneStatus.MENU_S: menuKeyHandler(keyCode); break;
            case eSceneStatus.GAME_S: gameKeyHandler(keyCode); break;
            default: alert("shoud not enter here"); break;
        }
    }
    
    function browserKeyHandler(e) {
        var keyCode;
        
        // we prevent default key behavior about using key
        if(e.keyCode == 32
            || e.keyCode == 68 || e.keyCode == 71 || e.keyCode == 75 || e.keyCode == 83 || e.keyCode == 80
            || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 40
        )
            e.preventDefault();

        switch(e.keyCode) {
             // Add more keys as needed
             case 32: keyCode = 'space'; break;
             case 68: keyCode = 'd'; break;
             case 71: keyCode = 'g'; break;
             case 75: keyCode = 'k'; break;
             case 83: keyCode = 's'; break;
             case 80: keyCode = 'p'; break;
             case 37: keyCode = 'left arrow'; break;
             case 39: keyCode = 'right arrow'; break;
             case 38: keyCode = 'up arrow'; break;
             case 40: keyCode = 'down arrow'; break;
             default: /*alert("Unhandled key");*/ return;
        }
        sceneKeyHandler(keyCode);
    }
    
    function tvKeyHandler() {
        var keyCode;
        alert("Key pressed: " + event.keyCode);
        switch(event.keyCode) {
            // Add more keys as needed
            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN: keyCode = 'return'; break;
            case tvKey.KEY_LEFT: keyCode = 'left arrow'; break;
            case tvKey.KEY_RIGHT: keyCode = 'right arrow'; break;
            case tvKey.KEY_UP: keyCode = 'up arrow'; break;
            case tvKey.KEY_DOWN: keyCode = 'down arrow'; break;
            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER: keyCode = 'enter'; break;
            default: alert("Unhandled key"); return;
        }
        sceneKeyHandler(keyCode);
    }

    game.keyHandler = function(e) {
        if(BROWSER) {
            browserKeyHandler(e);
        } else {
            tvKeyHandler();
        }
    };

    function Mapper() {
        this.idx = 0;
        this.MAX_IDX = 1;
    }
    
    Mapper.prototype = {
        left: function() {
            this.idx++;
            if(this.idx > this.MAX_IDX)
                this.idx = 0;
        },
        up: function() {
            this.idx++;
            if(this.idx > this.MAX_IDX)
                this.idx = 0;
        },
        right: function() {
            this.idx--;
            if(this.idx < 0)
                this.idx = this.MAX_IDX;
        }, down: function() {
            this.idx--;
            if(this.idx < 0)
                this.idx = this.MAX_IDX;
        },
        update: function() {
            $('#menu > li').attr('class', '');
            $('#item' + this.idx).attr('class', 'hoverd');
        },
        enter: function() {
            //HELLOANIPANG.game.start();
        }
    };

    var mapper = new Mapper();
    mapper.update();
    
    function addKeyListeners(gameCtx) {
        ///*
        gameCtx.addKeyListener({
                keyCode: BROWSER ? 'left arrow' : tvKey.KEY_LEFT,
                listener: function() {
                    mapper.left();
                    mapper.update();
                }
            }
        );
        
        gameCtx.addKeyListener({
                keyCode: BROWSER ? 'right arrow' : tvKey.KEY_RIGHT,
                listener: function() {
                    mapper.right();
                    mapper.update();
                }
            }
        );
        
        gameCtx.addKeyListener({
                keyCode: BROWSER ? 'up arrow' : tvKey.KEY_UP,
                listener: function() {
                    //alert("KEY_UP listener()...");
                    mapper.up();
                    mapper.update();
                }
            }
        );
        
        gameCtx.addKeyListener({
                keyCode: BROWSER ? 'down arrow' : tvKey.KEY_DOWN,
                listener: function() {
                    //alert("KEY_DOWN listener()...");
                    mapper.down();
                    mapper.update();
                }
            }
        );
        
        gameCtx.addKeyListener({
                keyCode: BROWSER ? 'enter' : tvKey.KEY_ENTER,
                listener: function() {
                    mapper.enter();
                    mapper.update();
                }
            }
        );
        
        if(BROWSER) {
            gameCtx.addKeyListener({
                    keyCode: 'g',
                    listener: function() {
                        bShowGrid = !bShowGrid;
                    }
                }
            );
        } else {
            gameCtx.addKeyListener({
                    keyCode: tvKey.KEY_PANEL_ENTER,
                    listener: function() {
                        mapper.enter();
                        mapper.update();
                    }
                }
            );
        }
    }
    
    var MatrixPainter = function(pMatrix, pGameCtx) {
        this.pImage = pGameCtx.getImage(URL_BLOCK_IMAGE);
        this.pMatrix = pMatrix;
        this.pGameCtx = pGameCtx;
    };
    
    MatrixPainter.prototype = {
        paint: function(sprite, context) {
            var i, j;
            var imgIdx;
            
            if(this.pImage !== undefined) {
                if(this.pImage.complete) {
                    for(i = 0; i < this.pMatrix.length; i++) {
                        for(j = 0; j < this.pMatrix[i].length; j++) {
                            imgIdx = this.pMatrix[i][j].imgIdx;
                            context.drawImage(this.pImage, 
                                imgIdx * AXIS_LENGTH_BLOCK_IMAGE, // src: xywh
                                0,
                                AXIS_LENGTH_BLOCK_IMAGE,
                                AXIS_LENGTH_BLOCK_IMAGE,
                                sprite.left + j * AXIS_LENGTH_BLOCK_IMAGE, // dst: xywh
                                sprite.top + i * AXIS_LENGTH_BLOCK_IMAGE,
                                AXIS_LENGTH_BLOCK_IMAGE,
                                AXIS_LENGTH_BLOCK_IMAGE);
                        }
                    }
                } else {
                }
            } else {
                this.pImage = this.pGameCtx.getImage(URL_BLOCK_IMAGE);
            }
            
            
        }
    };
    var SELECT_LINE_STYLE = [ 5, // line width
        'round', // line cap
        'round' // line joing
    ];
    var SELECT_LINE_WIDTH = 5,
        SELECT_LINE_CAP = 'round',
        SELECT_LINE_JOIN = 'round',
        SELECT_DEFAULT_COLOR = 'red',
        SELECT_PRESS_COLOR = '#ff9999';
        SELECT_CORNER_RADIUS = 5, SELECT_CORNER_LEN = 5;
    
    var selectPainter = {
        paint: function(sprite, context) {
            Util.drawRoundedCorner(context, 
                SELECT_LINE_STYLE, 
                selectStatus ? SELECT_PRESS_COLOR : SELECT_DEFAULT_COLOR,
                null,
                GRID_X + selectPosCol * GRID_STEP, GRID_Y + selectPosRow * GRID_STEP,
                GRID_STEP, GRID_STEP,
                SELECT_CORNER_RADIUS, SELECT_CORNER_LEN);
        }
    };
    
    //matrixSprite = new Sprite('matrixSprite', new MatrixPainter(matrix, game));
    //selectSprite = new Sprite('selectSprite', selectPainter);
    
    function addSprites(gameCtx) {
        gameCtx.addSprite(matrixSprite);
        gameCtx.addSprite(selectSprite);
    }
    
    function setSpritePosition(gameCtx) {
        matrixSprite.left = GRID_X;
        matrixSprite.top = GRID_Y;
    }
    
    function loadImages(gameCtx) {
        var interval, loadingPercentComplete = 0;
    
        gameCtx.queueImage(URL_BLOCK_IMAGE);
        interval = setInterval(function(e) {
            loadingPercentComplete = game.loadImages();
        
            if(loadingPercentComplete === 100) {
                clearInterval(interval);
                game.start();
                timerInfo.progressDiv.style.display = 'block';
            }
        }, 16);
        return true;
    }
    
    var globalInfo = undefined;
    var droppingInfo = undefined;
    var timerInfo = undefined;
    
    function prepareTimer() {
        var pt = timerInfo = new TimerInfo();
        pt.progressDiv = document.getElementById('progressDiv'),
        pt.progressBar = new HTML5.ProgressBar('progressCanvas', TIMER_W, TIMER_H);
        pt.progressDiv.appendChild(pt.progressBar.context.canvas);
        pt.progressBar.setMaxDegree(pt.TIMER_PLAYING_TIME);
        pt.lastTime = getTimeNow();
        pt.progressBar.drawDegreeToBuffer(pt.elapsedTime);
        pt.progressBar.draw();
    }
    
    (function start() {
        //addKeyListeners(game);
        //addKeyHandler(game);
        initializeMatrix(game);
        //initializeDefaultInfo(game);
        //createGlobalInfo(game);
        //createAndInitializeDroppingInfo(game);
        
        globalInfo = new GlobalInfo(GRID_MAX, GRID_MAX);
        droppingInfo = new DroppingInfo(GRID_MAX, GRID_MAX);
        
        prepareTimer(game);
        //generateNumbers(game);
        //addSprites(game);
        //setSpritePosition();
        loadImages(game); // start in here
    })();
};
