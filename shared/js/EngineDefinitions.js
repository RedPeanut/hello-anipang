EngineDefinitions = function() {
    this.DESIRED_FPS = 24, 
    this.DESIRED_SPF = 1000 / this.DESIRED_FPS;
}
EngineDefinitions.prototype = {};
var engineDefinitions = new EngineDefinitions();
/*
var EngineDefinitions = {
    DESIRED_FPS: 24,
    DESIRED_SPF: 1000 / this.DESIRED_FPS
}//*/