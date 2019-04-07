function UtilCtor() {
    this.roundedRect = function(context, cornerX, cornerY, width, height, cornerRadius) {
        if(width > 0) context.moveTo(cornerX + cornerRadius, cornerY);
        else context.moveTo(cornerX - cornerRadius, cornerY);
    
        context.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);
        context.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);
        context.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);
        
        if(width > 0) {
           context.arcTo(cornerX, cornerY, cornerX + cornerRadius, cornerY, cornerRadius);
        } else {
            context.arcTo(cornerX, cornerY, cornerX - cornerRadius, cornerY, cornerRadius);
        }
    },
    this.roundedCorner = function(context, cornerX, cornerY, width, height, cornerRadius, cornerLen) {
        // lt
        context.beginPath();
        context.moveTo(cornerX, cornerY + cornerRadius + cornerLen);
        context.lineTo(cornerX, cornerY + cornerRadius);
        context.beginPath();
        context.arc(cornerX + cornerRadius, cornerY + cornerRadius, cornerRadius, 
            -Math.PI, -Math.PI/2, false);
        context.beginPath();
        context.moveTo(cornerX + cornerRadius, cornerY);
        context.lineTo(cornerX + cornerRadius + cornerLen, cornerY);
        
        // rt
        
        // rb
        // lb
    };
}

UtilCtor.prototype = {
    
    drawRoundedTitledRect: function(context, 
        lineStyle, fillStyle, 
        xywh, cornerRadius,
        titleFontStyle, title, marginFromTitle,
        descFontStyle, desc) {
        
        var x = xywh[0], y = xywh[1], w = xywh[2], h = xywh[3],
            r = cornerRadius;
        
        context.save();
        
        context.font = titleFontStyle[0] || context.font;
        context.textAlign = titleFontStyle[1] || context.textAlign;
        context.textBaseline = titleFontStyle[2] || context.textBaseline;
        //context.strokeStyle = titleFontStyle[3] || context.strokeStyle;
        context.fillStyle = titleFontStyle[4] || context.fillStyle;
        
        context.fillText(title, x + r + 5 + marginFromTitle, y);
        var textLen = context.measureText(title);

        context.font = descFontStyle[0] || context.font;
        context.textAlign = descFontStyle[1] || context.textAlign;
        context.textBaseline = descFontStyle[2] || context.textBaseline;
        //context.strokeStyle = descFontStyle[3] || context.strokeStyle;
        context.fillStyle = descFontStyle[4] || context.fillStyle;
        
        context.fillText(desc, x + 15, y + 30);

        context.lineWidth = lineStyle[0] || context.lineWidth;
        context.lineCap = lineStyle[1] || context.lineCap;
        context.lineJoin = lineStyle[2] || context.lineJoin;
        
        context.strokeStyle = lineStyle[3] || context.strokeStyle;
        
        context.beginPath();
        context.arc(x + r, y + r, r, -Math.PI, -Math.PI/2, false);
        context.moveTo(x + r, y);
        context.lineTo(x + r + 5, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x + r + 5 + marginFromTitle * 2 + textLen.width, y);
        context.lineTo(x + w - r, y);
        context.arc(x + w - r, y + r, r, -Math.PI/2, 0, false);
        context.moveTo(x + w, y + r);
        context.lineTo(x + w, y + h - r);
        context.arc(x + w - r, y + h - r, r, 0, Math.PI/2, false);
        context.moveTo(x + w - r, y + h);
        context.lineTo(x + r, y + h);
        context.arc(x + r, y + h - r, r, Math.PI/2, Math.PI, false);
        context.moveTo(x, y + h - r);
        context.lineTo(x, y + r);
        
        context.stroke();
        
        context.restore();
    },
    drawRoundedCorner: function(context,
        lineStyle,
        strokeStyle,
        fillStyle,
        cornerX, cornerY, width, height,
        cornerRadius, cornerLen) {
        
        context.save();
        
        context.lineWidth = lineStyle[0] || context.lineWidth;
        context.lineCap = lineStyle[1] || context.lineCap;
        context.lineJoin = lineStyle[2] || context.lineJoin;
        context.strokeStyle = strokeStyle; // color
        
        // lt
        context.beginPath();
        context.moveTo(cornerX, cornerY + cornerRadius + cornerLen);
        context.lineTo(cornerX, cornerY + cornerRadius);
        context.stroke();
        context.beginPath();
        context.arc(cornerX + cornerRadius, cornerY + cornerRadius, cornerRadius, -Math.PI, -Math.PI/2, false);
        context.stroke();
        context.beginPath();
        context.moveTo(cornerX + cornerRadius, cornerY);
        context.lineTo(cornerX + cornerRadius + cornerLen, cornerY);
        context.stroke();
        
        // rt
        context.beginPath();
        context.moveTo(cornerX + width - cornerRadius - cornerLen, cornerY);
        context.lineTo(cornerX + width - cornerRadius, cornerY);
        context.stroke();
        context.beginPath();
        context.arc(cornerX + width - cornerRadius, cornerY + cornerRadius, cornerRadius, -Math.PI/2, 0, false);
        context.stroke();
        context.beginPath();
        context.moveTo(cornerX + width, cornerY + cornerRadius);
        context.lineTo(cornerX + width, cornerY + cornerRadius + cornerLen);
        context.stroke();
        
        // rb
        context.beginPath();
        context.moveTo(cornerX + width, cornerY + height - cornerRadius - cornerLen);
        context.lineTo(cornerX + width, cornerY + height - cornerRadius);
        context.stroke();
        context.beginPath();
        context.arc(cornerX + width - cornerRadius, cornerY + height - cornerRadius, cornerRadius, 0, Math.PI/2, false);
        context.stroke();
        context.beginPath();
        context.moveTo(cornerX + width - cornerRadius, cornerY + height);
        context.lineTo(cornerX + width - cornerRadius - cornerLen, cornerY + height);
        context.stroke();
        
        // lb
        context.beginPath();
        context.moveTo(cornerX + cornerRadius + cornerLen, cornerY + height);
        context.lineTo(cornerX + cornerRadius, cornerY + height);
        context.stroke();
        context.beginPath();
        context.arc(cornerX + cornerRadius, cornerY + height - cornerRadius, cornerRadius, Math.PI/2, Math.PI, false);
        context.stroke();
        context.beginPath();
        context.moveTo(cornerX, cornerY + height - cornerRadius);
        context.lineTo(cornerX, cornerY + height - cornerRadius - cornerLen);
        context.stroke();        
        
        context.restore();
    },
    drawRoundedRect: function(context, strokeStyle, fillStyle, cornerX, cornerY, width, height, cornerRadius) {
        context.beginPath();
    
        this.roundedRect(context, cornerX, cornerY, width, height, cornerRadius);
        
        // null: black, undefined: black
        if(strokeStyle !== undefined && strokeStyle !== null && strokeStyle !== 0) {
            context.strokeStyle = strokeStyle;
            context.stroke();
        }
        if(fillStyle !== undefined && fillStyle !== null && fillStyle !== 0) {    
            context.fillStyle = fillStyle;
            context.fill();
        }
    }
};

var Util = new UtilCtor();

