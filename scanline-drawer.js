
class ScanlineDrawer {
    drawSet() {
        console.time("draw");
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        var width = this.canvas.width;
        var height = this.canvas.height;
        this.ctx.fillStyle = "#010038";
        this.ctx.fillRect(0, 0, width, height);
        this.drawRows(0, height);
    }

    drawRows(start, end) {
        var width = this.canvas.width;
        var j = start;
        for (var i = 0; i < width; i++) {
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

        if (nextRow % 7 === 0) {
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
