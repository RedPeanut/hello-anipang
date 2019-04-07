function TimerInfo() {
    //this.PROGRESS_W = 340, this.PROGRESS_H = 30;
    this.progressDiv, this.progressBar;
    
    this.TIMER_PLAYING_TIME = 60;
    this.elapsedTime = this.TIMER_PLAYING_TIME, this.lastTime;
}

TimerInfo.prototype = {
    reset: function() {
        this.elapsedTime = this.TIMER_PLAYING_TIME;
    }
}