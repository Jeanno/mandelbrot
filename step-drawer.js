class StepDrawer {
    constructor(mandelbrotCanvas) {
        this._mandelbrotCanvas = mandelbrotCanvas;
        this._timeout = null;
        var canvas = this._mandelbrotCanvas.canvas;

        this._maxIter = 500;
        this._zs = new Array(canvas.height * canvas.width);
        this.initZ();

        this._colorCache = [];
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

        var that = this;
        this._timeout = setTimeout(function() {
            that.drawStep(0);
        }, 0);
    }

    drawStep(iter) {
        var mc = this._mandelbrotCanvas;
        // Use multi inner loop to increase locality
        var multi = Math.min(iter + 1, 128);
        var top = mc.top;
        var left = mc.left;
        var step = mc.step;
        var threshold = 4.0;
        for (var j = 0; j < mc.canvas.height; j++) {
            var y0 = top - j * step;
            var fillFrom = 0;

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
                        this.drawPx(i, j, iter + k);
                        this._maxIter = Math.max(this._maxIter, ((iter + k) * 1.05)|0);
                    }
                    z[1] = 2 * z[0] * z[1] + y0;
                    z[0] = xsq - ysq + x0;
                }
            }
        }

        if (iter + multi < this._maxIter) {
            var that = this;
            this._timeout = setTimeout(function() {
                that.drawStep(iter + multi);
            }, 0);
        } else {
            console.timeEnd("draw");
            console.log("max iter: " + this._maxIter);
        }

    }

    getColorForStep(step) {
        if (step === -1) {
            return "#000";
        } else {
            var ret = this._colorCache[step];
            if (!ret) {
                var denominator = 1000;
                var frac_sq = Math.pow(step, 1/2.5) / Math.pow(denominator, 1/2.5);
                var frac = step / denominator;
                var h = 241.1 * (1 - frac_sq) + 37 * frac_sq;
                var s = 100 * (1 - frac * (1 - frac));
                var l = 100 * (0.1 + frac_sq) / 1.1;

                ret = this._colorCache[step] = 'hsl(' + h + ',' + s + '%,' + l + '%)';
            }
            return ret;
        }
    }

    drawPx(x, y, step) {
        var mc = this._mandelbrotCanvas;
        mc.ctx.fillStyle = this.getColorForStep(step);
        mc.ctx.fillRect(x, y, 1, 1);
    }
}
