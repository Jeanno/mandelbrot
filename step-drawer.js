class StepDrawer {
    constructor(mandelbrotCanvas) {
        this._mandelbrotCanvas = mandelbrotCanvas;
        this._timeout = null;
        var canvas = this._mandelbrotCanvas.canvas;

        this._maxIter = 100;
        this._zs = new Array(canvas.height * canvas.width);
        this.initZ();
    }

    getZ(x, y) {
        var canvas = this._mandelbrotCanvas.canvas;
        return this._zs[y * canvas.width + x];
    }

    initZ() {
        for (var i = 0; i < this._zs.length; i++) {
            this._zs[i] = [0, 0, false];
        }
    }

    clearZ() {
        for (var i = 0; i < this._zs.length; i++) {
            var z = this._zs[i];
            z[0] = 0;
            z[1] = 0;
            z[2] = false;
        }
    }

    drawSet() {
        console.log("max iterm: " + this._maxIter);
        var mc = this._mandelbrotCanvas;
        console.time("draw");
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        var width = mc.canvas.width;
        var height = mc.canvas.height;
        this.clearZ();
        mc.ctx.fillStyle = "#000";
        mc.ctx.fillRect(0, 0, width, height);
        this.drawStep(0);
    }

    drawStep(iter) {
        var mc = this._mandelbrotCanvas;
        var multi = 8;
        var top = mc.top;
        var left = mc.left;
        var step = mc.step;
        var threshold = 4.0;
        var canvas = this._mandelbrotCanvas.canvas;
        for (var j = 0; j < mc.canvas.height; j++) {
            var y0 = top - j * step;
            for (var i = 0; i < mc.canvas.width; i++) {
                var z = this.getZ(i, j);
                for (var k = 0; k < multi; k++) {
                    if (z[2]) {
                        break;
                    }
                    var x0 = left + i * step;
                    var xsq = z[0] * z[0];
                    var ysq = z[1] * z[1];
                    if (xsq + ysq > threshold) {
                        z[2] = true;
                        this._maxIter = Math.max(this._maxIter, (iter + k) * 1.1);
                        this.drawPx(i, j, iter + k);
                    }
                    z[1] = 2 * z[0] * z[1] + y0;
                    z[0] = xsq - ysq + x0;
                }
            }
        }

        if (iter < this._maxIter) {
            var that = this;
            this._timeout = setTimeout(function() {
                that.drawStep(iter + multi);
            }, 0);
        } else {
            console.timeEnd("draw");
        }

    }

    drawPx(x, y, step) {
        var mc = this._mandelbrotCanvas;
        if (step === -1) {
            mc.ctx.fillStyle = "#000000";
        } else {
            var denominator = 1000;
            var frac_sq = Math.pow(step, 1/2.5) / Math.pow(denominator, 1/2.5);
            var frac = step / denominator;
            var h = 241.1 * (1 - frac_sq) + 37 * frac_sq;
            var s = 100 * (1 - frac * (1 - frac));
            var l = 100 * (0.1 + frac_sq) / 1.1;

            mc.ctx.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
        }
        mc.ctx.fillRect(x, y, 1, 1);
    }
}
