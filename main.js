
function mag(x, y) {
    return x*x + y*y;
}

function f(x0, y0) {
    // TODO: use high precision calculation
    var max_i = 400;
    var threshold = 100000000;
    var x = 0;
    var y = 0;
    
    for (var i = 0; i < max_i; i++) {
        x += x0;
        y += y0;
        if (mag(x, y) > threshold) {
            return i;
        }
        var new_x = x * x - y * y;
        var y = 2 * x * y;
        var x = new_x;
    }
    return -1;
}

class MandelbrotCanvas {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.left = -2;
        this.top = 1;
        this.scale = 1;
        this.step = 2 / this.canvas.height * this.scale;

        this.ctx.scale(this.scale, this.scale);

        var that = this;
        this.canvas.addEventListener('click', function(e) {
            that.onClick(e);
        }, false);
    }

    onClick(e) {
        // Reposition center to click
        this.left += (e.offsetX - this.canvas.width / 2) * this.step / this.scale;
        this.top -= (e.offsetY - this.canvas.height / 2) * this.step / this.scale;
        this.step /= 1.5;

        this.drawSet();


        console.log(e);
    }


    drawSet() {
        var width = this.canvas.width / this.scale;
        var height = this.canvas.height / this.scale;
        this.ctx.fillStyle = "#010038";
        this.ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < width / this.scale; i++) {
            for (var j = 0; j < height / this.scale; j++) {
                var x = this.left + i * this.step;
                var y = this.top - j * this.step;
                var iter = f(x, y);
                if (iter === -1) {
                    this.draw(i, j);
                } else if (iter > 70) {
                    this.drawOuter1(i, j);
                } else if (iter > 50) {
                    this.drawOuter2(i, j);
                } else if (iter > 30) {
                    this.drawOuter3(i, j);
                }

                // Adjust brightness according to iter
            }
        }
    }

    drawOuter3(x, y) {
        this.ctx.fillStyle = "#537ec5";
        this.ctx.fillRect(x, y, 1, 1);
    }

    drawOuter2(x, y) {
        this.ctx.fillStyle = "#f39422";
        this.ctx.fillRect(x, y, 1, 1);
    }

    drawOuter1(x, y) {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(x, y, 1, 1);
    }

    draw(x, y) {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, 1, 1);
    }

}


var mc = new MandelbrotCanvas("my-canvas");
mc.drawSet();