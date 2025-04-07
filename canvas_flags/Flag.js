export default class Flag {
    constructor(countryName, countryColors, aspectRatio, alignment, canvas) {
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.countryName = countryName;
        this.countryColors = countryColors;
        this.aspectRatio = aspectRatio;
        this.alignment = alignment;
        this.canvas = canvas;
        const context = canvas.getContext("2d");
        if (context) {
            Flag.ctx = context;
        }
        else {
            throw new Error("Failed to get 2D context from canvas.");
        }
        let aspect = this.aspectRatio.split(":");
        this.canvasHeight =
            (parseInt(aspect[0]) * window.innerWidth) / 2.5 / parseInt(aspect[1]);
        this.canvasWidth = window.innerWidth / 2.5;
        this.setAspectRation();
    }
    setAspectRation() {
        Flag.ctx.canvas.width = this.canvasWidth;
        Flag.ctx.canvas.height = this.canvasHeight;
    }
    drawRectangle(x, y, w, h, color) {
        Flag.ctx.beginPath();
        Flag.ctx.fillStyle = "#" + color;
        Flag.ctx.fillRect(x, y, w, h);
    }
    drawFlag() {
        const stripeCount = this.countryColors.length;
        const isHorizontal = this.alignment === "horizontal";
        const stripeSize = isHorizontal
            ? this.canvasHeight / stripeCount
            : this.canvasWidth / stripeCount;
        for (let i = 0; i < stripeCount; i++) {
            const x = isHorizontal ? 0 : stripeSize * i;
            const y = isHorizontal ? stripeSize * i : 0;
            const width = isHorizontal ? this.canvasWidth : stripeSize;
            const height = isHorizontal ? stripeSize : this.canvasHeight;
            this.drawRectangle(x, y, width, height, this.countryColors[i]);
        }
    }
}
