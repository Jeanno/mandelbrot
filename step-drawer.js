class StepDrawer {
    constructor(mandelbrotCanvas) {
        this._mandelbrotCanvas = mandelbrotCanvas;
        this._timeout = null;
        var canvas = this._mandelbrotCanvas.canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this._ctx = canvas.ctx;

        this._maxIter = 500;
        this._zs = new Array(canvas.height * canvas.width);
        this.initZ();

        this._colorCache = [];
    }

    getZ(x, y) {
        return this._zs[y * this.width + x];
    }

    initZ() {
        for (var i = 0; i < this._zs.length; i++) {
            this._zs[i] = [0, 0, false];
        }
    }

    clearZ() {
        var mc = this._mandelbrotCanvas;
        var top = mc.top;
        var left = mc.left;
        var step = mc.step;
        var width = mc.canvas.width;
        for (var j = 0; j < mc.canvas.height; j++) {
            var y0 = top - j * step;
            for (var i = 0; i < width; i++) {
                var x0 = left + i * step;
                var z = this.getZ(i, j);
                z[0] = x0;
                z[1] = y0;
                z[2] = false;
            }
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

        this._timeout = setTimeout(this.drawStep.bind(this, 0), 0);
    }

    drawStep(iter) {
        var mc = this._mandelbrotCanvas;
        // Use multi inner loop to increase locality
        var multi = Math.min(iter + 1, 32);
        var top = mc.top;
        var left = mc.left;
        var step = mc.step;
        var threshold = 4.0;
        var width = mc.canvas.width;
        for (var j = 0; j < mc.canvas.height; j++) {
            var y0 = top - j * step;
            var fillFrom = 0;

            for (var i = 0; i < width; i++) {
                var z = this.getZ(i, j);
                for (var k = 0; k < multi; k++) {
                    if (z[2]) {
                        break;
                    }
                    var x0 = left + i * step;
                    var z0 = z[0];
                    var z1 = z[1];
                    var xsq = z0 * z0;
                    var ysq = z1 * z1;
                    if (xsq + ysq > threshold) {
                        z[2] = true;
                        this.drawPx(i, j, iter + k);
                        this._maxIter = Math.max(this._maxIter, ((iter + k) * 1.02)|0);
                    }
                    z[1] = 2.0 * z0 * z1 + y0;
                    z[0] = xsq - ysq + x0;
                }
            }
        }

        if (iter + multi < this._maxIter) {
            this._timeout = setTimeout(this.drawStep.bind(this, iter + multi), 0);
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
        var ctx = this._mandelbrotCanvas.ctx;
        ctx.fillStyle = this.getColorForStep(step);
        ctx.fillRect(x, y, 1, 1);
    }
}
