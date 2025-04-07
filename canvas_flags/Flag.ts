export default class Flag {
  /* Property Definition */
  readonly countryName: string;
  readonly countryColors: string[];
  readonly aspectRatio: string;
  readonly alignment: string;

  readonly canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;

  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  constructor(
    countryName: string,
    countryColors: string[],
    aspectRatio: string,
    alignment: string,
    canvas: HTMLCanvasElement
  ) {
    this.countryName = countryName;
    this.countryColors = countryColors;
    this.aspectRatio = aspectRatio;
    this.alignment = alignment;

    this.canvas = canvas;

    const context = canvas.getContext("2d");
    if (context) {
      Flag.ctx = context;
    } else {
      throw new Error("Failed to get 2D context from canvas.");
    }

    let aspect = this.aspectRatio.split(":");

    this.canvasHeight =
      (parseInt(aspect[0]) * window.innerWidth) / 2.5 / parseInt(aspect[1]);
    this.canvasWidth = window.innerWidth / 2.5;

    this.setAspectRation();
  }

  public setAspectRation(): void {
    Flag.ctx.canvas.width = this.canvasWidth;
    Flag.ctx.canvas.height = this.canvasHeight;
  }

  public drawRectangle(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ): void {
    Flag.ctx.beginPath();
    Flag.ctx.fillStyle = "#" + color;
    Flag.ctx.fillRect(x, y, w, h);
  }

  public drawFlag(): void {
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
