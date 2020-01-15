
function mag(x, y) {
    return x*x + y*y;
}



var MAX_ITERATION = 1000;
function f(x0, y0) {
    // TODO: use high precision calculation
    var threshold = 100;
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

class MandelbrotCanvas {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.left = -2.8;
        this.top = 1.2;
        this.scale = 1;
        this.step = 2.4 / this.canvas.height * this.scale;

        this.ctx.scale(this.scale, this.scale);

        this._timeout = null;

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
        console.log(e);
    }


    drawSet() {
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
            var iter = f(x, y);
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

        var nextRow = null;
        if (start + 2 >= end) {
            if ((start % 2) === 1) {
                return;
            } else {
                nextRow = 1;
            }
        } else {
            nextRow = start + 2;
        }

        var that = this;
        this._timeout = setTimeout(function() {
            that.drawRows(nextRow, end);
        }, 1);
    }

    draw(x, y) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, 1, 1);
    }

}


var mc = new MandelbrotCanvas("my-canvas");
mc.drawSet();
