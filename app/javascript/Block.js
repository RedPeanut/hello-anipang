var eBlockStatus = { NONE: 0, SELECT: 1, MOVING: 2, BOMBING: 3, BLANK: 4, DROPPING: 5 }

// for change bombing animation frame per sec
// use term, 'frame per duration'
var BOMB_ANI_N_FRAME = 2,
    BOMB_ANI_DURATION = 0.2, // sec
    BOMB_ANI_FPD = BOMB_ANI_N_FRAME / BOMB_ANI_DURATION, // Frame Per Duration
    BOMB_ANI_DPF = BOMB_ANI_DURATION / BOMB_ANI_N_FRAME;

function Block(imgIdx, status) {
    this.imgIdx = imgIdx,
    this.status = status || eBlockStatus.NONE,
    
    // for bombing
    // first bomb animation image is positioned after original image
    // so the bombIdx is started from 1
    this.bombIdx = 1;
    this.nShowedFrame = 0;
    
    // for dropping
    this.nBlankBlockUnderMe = 0;
    this.droppingVelocityY = 0, this.droppingDeltaY = 0; this.droppingDistanceY = 0;
}

Block.prototype = {
    setImgIdx: function(imgIdx) {
        this.imgIdx = imgIdx;
    },
    setStatus: function(status) {
        this.status = status;
    },
    getStatus: function() {
        return this.status;
    },
    resetDroppingInfo: function() {
        this.nBlankBlockUnderMe = 0;
        this.droppingVelocityY = 0, this.droppingDeltaY = 0; this.droppingDistanceY = 0;
    },
    copy: function(pblk) {
        this.imgIdx = pblk.imgIdx;
        this.status = pblk.status;
        
//         this.bombIdx = pblk.bombIdx;
//         this.nShowedFrame = pblk.nShowedFrame;
        
//         this.nBombBlockUnderMe = pblk.nBombBlockUnderMe;
    }
};