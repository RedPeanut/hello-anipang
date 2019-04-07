/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

var HTML5 = HTML5 || {};

HTML5.ColorStop = function(pos, rgb) { this.pos = pos, this.rgb = rgb; };
HTML5.ProgressBar = function(id, w, h) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = id;
    this.context = this.canvas.getContext('2d');
    this.context.canvas.width = w; this.context.canvas.height = h;
    
    this.background = document.createElement('canvas').getContext('2d'),
    this.foreground = document.createElement('canvas').getContext('2d');
    //this.text = document.createElement('canvas').getContext('2d');
    this.background.canvas.width = w; this.background.canvas.height = h;

    this.left = 0, this.top = 0,
    this.width = w; this.height = h;
    this.right = this.left + this.width, this.bottom = this.top + this.height;
    this.cornerRadius = this.height/2;

    this.drawBkgToBuffer(this.background, null, 'rgba(191, 191, 191, 0.5)');
    
    this.foreground.canvas.width = w, this.foreground.canvas.height = h,
    this.foreground_padding_left = 5, this.foreground_padding_top = 6,
    this.foreground_left = this.foreground_padding_left, this.foreground_top = this.foreground_padding_top,
    this.foreground_right = this.width - this.foreground_padding_left,
    this.foreground_bottom = this.height - this.foreground_padding_top,
    this.foreground_width = this.width - this.foreground_padding_left * 2;
    this.foreground_height = this.height - this.foreground_padding_top * 2,
    this.foreground_cornerRadius = this.foreground_height / 2;    
    
    this.colorStops = [ new HTML5.ColorStop(0, 'white'),  
            new HTML5.ColorStop(0.5, 'rgb(146, 208, 80)'),
            new HTML5.ColorStop(1, 'rgb(0, 176, 80)'),
        ];
    
    this.font = 'bold 20px arial', this.textAlign = 'center', this.textBaseline = 'middle';
    /*
    this.drawFrgToBufferWithTxt(this.foreground, null,
        [ new HTML5.ColorStop(0, 'white'),  
            new HTML5.ColorStop(0.5, 'rgb(146, 208, 80)'),
            new HTML5.ColorStop(1, 'rgb(0, 176, 80)'),
        ]);
    //*/
    
    this.maxDegree = undefined;
    
    return this;
};

HTML5.ProgressBar.prototype = {
    setMaxDegree: function(maxDegree) {
        this.maxDegree = maxDegree;
    },
    draw: function() {
        this.erase();
        this.context.drawImage(this.background.canvas, 0, 0);
        this.context.drawImage(this.foreground.canvas, 0, 0);
        //this.context.drawImage(this.text.canvas, 0, 0);
    },
    drawBkgToBuffer: function(context, strokeStyle, fillStyle) {
        
        context.save();

        context.beginPath();

        context.moveTo(this.left + this.cornerRadius, this.top);
        context.lineTo(this.right - this.cornerRadius, this.top);
        context.arc(this.right - this.cornerRadius, this.top + this.cornerRadius, this.cornerRadius, -Math.PI/2, Math.PI/2);
        context.lineTo(this.left + this.cornerRadius, this.top + this.cornerRadius*2);
        context.arc(this.left + this.cornerRadius, this.top + this.cornerRadius, this.cornerRadius, Math.PI/2, -Math.PI/2);

        context.fillStyle = fillStyle;
        context.fill();

        if(strokeStyle) {
            context.lineWidth = 0.4;
            context.strokeStyle = strokeStyle;
            context.stroke();
        }

        context.restore();
    },
    drawDegreeToBuffer: function(degree) {

        var ratio = degree / this.maxDegree,
            ratioWidth = this.foreground_width * ratio;
            right = this.foreground_left + ratioWidth;
        var context = this.foreground, strokeStyle = null, colorStops = this.colorStops;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.save();

        context.beginPath();

        if(degree) {
            
            var rightCornerAnchor_X = right - this.foreground_cornerRadius
            if(rightCornerAnchor_X < this.foreground_left + this.foreground_cornerRadius)
                rightCornerAnchor_X = this.foreground_left + this.foreground_cornerRadius
            
            context.moveTo(this.foreground_left + this.foreground_cornerRadius, this.foreground_top);
            context.lineTo(rightCornerAnchor_X, this.foreground_top);
            context.arc(rightCornerAnchor_X, this.foreground_top + this.foreground_cornerRadius, this.foreground_cornerRadius, -Math.PI/2, Math.PI/2);
            context.lineTo(this.foreground_left + this.foreground_cornerRadius, this.foreground_bottom);
            context.arc(this.foreground_left + this.foreground_cornerRadius, this.foreground_top + this.foreground_cornerRadius, this.foreground_cornerRadius, Math.PI/2, -Math.PI/2);
    
            if(strokeStyle) {
                context.lineWidth = 0.4;
                context.strokeStyle = strokeStyle;
                context.stroke();
            }
            
            context.shadowColor = undefined;
            var gradient = context.createLinearGradient(this.foreground_left, this.foreground_top, this.foreground_left, this.foreground_bottom);
            var i;
            for(i = 0; i < colorStops.length; i++) {
                gradient.addColorStop(colorStops[i].pos, colorStops[i].rgb);
            }
            context.fillStyle = gradient;
            context.fill();
        }
        
        context.fillStyle = 'white';
        context.font = this.font,
        context.textAlign = this.textAlign,
        context.textBaseline = this.textBaseline;
        
        context.fillText(degree, this.width/2, this.height/2);

        context.restore();
    },
    drawFrgToBuffer: function(context, strokeStyle, colorStops) {

        context.save();

        context.beginPath();

        context.moveTo(this.foreground_left + this.foreground_cornerRadius, this.foreground_top);
        context.lineTo(this.foreground_right - this.foreground_cornerRadius, this.foreground_top);
        context.arc(this.foreground_right - this.foreground_cornerRadius, this.foreground_top + this.foreground_cornerRadius, this.foreground_cornerRadius, -Math.PI/2, Math.PI/2);
        context.lineTo(this.foreground_left + this.foreground_cornerRadius, this.foreground_bottom);
        context.arc(this.foreground_left + this.foreground_cornerRadius, this.foreground_top + this.foreground_cornerRadius, this.foreground_cornerRadius, Math.PI/2, -Math.PI/2);

        if(strokeStyle) {
            context.lineWidth = 0.4;
            context.strokeStyle = strokeStyle;
            context.stroke();
        }
        
        context.shadowColor = undefined;
        var gradient = context.createLinearGradient(this.foreground_left, this.foreground_top, this.foreground_left, this.foreground_bottom);
        var i;
        for(i = 0; i < colorStops.length; i++) {
            gradient.addColorStop(colorStops[i].pos, colorStops[i].rgb);
        }
        context.fillStyle = gradient;
        context.fill();

        context.restore();
    },
    erase: function() {
        this.context.clearRect(this.left, this.top, this.context.canvas.width, this.context.canvas.height);
    }
};
