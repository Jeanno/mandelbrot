
class StandardEscapeTime {
    static cal(x0, y0) {
        var MAX_ITERATION = 1000;
        var threshold = 4.0;
        var x = 0;
        var y = 0;
        for (var i = 0; i < MAX_ITERATION; i++) {
            var xsq = x * x;
            var ysq = y * y;
            if (xsq + ysq > threshold) {
                return i;
            }
            var new_x = xsq - ysq + x0;
            y = 2 * x * y + y0;
            x = new_x;
        }
        return -1;
    }
}

function AsmJsEscapeTime(stdlib, foreign, buffer) {
    "use asm";

    function cal(x0, y0) {
        x0 = +x0;
        y0 = +y0;
        var MAX_ITERATION = 1000;
        var threshold = 4.0;
        var x = 0.0;
        var y = 0.0;
        var i = 0;
        var xsq = 0.0;
        var ysq = 0.0;
        var new_x = 0.0;
        for (i = 0; (i|0) < (MAX_ITERATION|0); i = (i + 1)|0) {
            xsq = +(x * x);
            ysq = +(y * y);
            if (+(xsq + ysq) > +(threshold)) {
                return i|0;
            }
            new_x = +(xsq - ysq + x0);
            y = +(2.0 * x * y + y0);
            x = +new_x;
        }
        return -1|0;
    }

    return { cal : cal };
}



class MandelbrotCanvas {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.left = -2.8;
        this.top = 1.2;
        this.step = 2.4 / this.canvas.height;


        this._drawer = new StepDrawer(this);
        //this._escapeTimeFunc = AsmJsEscapeTime().cal;
        //this._escapeTimeFunc = StandardEscapeTime.cal;

        var that = this;
        this.canvas.addEventListener('click', function(e) {
            that.onClick(e);
        }, false);
    }

    onClick(e) {
        var scale = 2.0;
        // Reposition center to click
        //
        this.left += (e.offsetX - this.canvas.width / 2 / scale) * this.step;
        this.top -= (e.offsetY - this.canvas.height / 2 / scale) * this.step;
        this.step /= scale;

        this.drawSet();
    }

    drawSet() {
        this._drawer.drawSet()
    }


}


function testEscapeTime() {
    console.time("asm");
    for (var i = 0; i < 100; i++) {
        AsmJsEscapeTime().cal(0,0);
    }
    console.timeEnd("asm");
    console.time("std");
    for (var i = 0; i < 100; i++) {
        StandardEscapeTime.cal(0,0);
    }
    console.timeEnd("std");
}

var mc = new MandelbrotCanvas("my-canvas");
mc.drawSet();
