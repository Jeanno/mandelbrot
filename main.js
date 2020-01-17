
function mag(x, y) {
    return x*x + y*y;
}


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
        this.scale = 1;
        this.step = 2.4 / this.canvas.height * this.scale;

        this.ctx.scale(this.scale, this.scale);

        this._timeout = null;
        this._escapeTimeFunc = AsmJsEscapeTime().cal;
        //this._escapeTimeFunc = StandardEscapeTime.cal;

        var that = this;
        this.canvas.addEventListener('click', function(e) {
            that.onClick(e);
        }, false);
    }

    onClick(e) {
        var scale = 1.5;
        // Reposition center to click
        //
        this.left += (e.offsetX - this.canvas.width / 2 / scale) * this.step;
        this.top -= (e.offsetY - this.canvas.height / 2 / scale) * this.step;
        this.step /= scale;

        this.drawSet();
    }


    drawSet() {
        console.time("draw");
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        var width = this.canvas.width / this.scale;
        var height = this.canvas.height / this.scale;
        this.ctx.fillStyle = "#010038";
        this.ctx.fillRect(0, 0, width, height);
        this.drawRows(0, height);
    }

    drawRows(start, end) {
        var width = this.canvas.width / this.scale;
        var j = start;
        for (var i = 0; i < width / this.scale; i++) {
            var x = this.left + i * this.step;
            var y = this.top - j * this.step;
            var iter = this._escapeTimeFunc(x, y);
            if (iter === -1) {
                this.draw(i, j);
            } else {
                var denominator = 1000;
                var frac_sq = Math.pow(iter, 1/2.5) / Math.pow(denominator, 1/2.5);
                var frac = iter / denominator;
                var h = 241.1 * (1 - frac_sq) + 37 * frac_sq;
                var s = 100 * (1 - frac * (1 - frac));
                var l = 100 * (0.1 + frac_sq) / 1.1;

                this.ctx.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
                this.ctx.fillRect(i, j, 1, 1);
            }
        }

        var nextRow = 0;
        if (start + 2 >= end) {
            if ((start % 2) === 1) {
                console.timeEnd("draw");
                return;
            } else {
                nextRow = 1;
            }
        } else {
            nextRow = start + 2;
        }

        if (nextRow % 3 === 0) {
            var that = this;
            this._timeout = setTimeout(function() {
                that.drawRows(nextRow, end);
            }, 0);
        } else {
            this.drawRows(nextRow, end);
        }
    }

    draw(x, y) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, 1, 1);
    }

}


function testEscapeTime() {
    console.time("asm");
    AsmJsEscapeTime().cal(0.0);
    console.timeEnd("asm");
    console.time("std");
    StandardEscapeTime.cal(0,0);
    console.timeEnd("std");
}

testEscapeTime()
var mc = new MandelbrotCanvas("my-canvas");
mc.drawSet();
