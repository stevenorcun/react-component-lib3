class NiceScale {
  public lowerBound: number;

  public upperBound: number;

  public maxTicks: number;

  public tickSpacing: number;

  public range: number;

  public niceLowerBound: number;

  public niceUpperBound: number;

  constructor(lowerBound: number, upperBound: number, _maxTicks: number) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.maxTicks = _maxTicks || 10;

    this.calculate();
  }

  setMaxTicks(_maxTicks: number) {
    this.maxTicks = _maxTicks;
    this.calculate();
  }

  getMaxTicks() {
    return this.maxTicks;
  }

  getNiceUpperBound() {
    return this.niceUpperBound;
  }

  getNiceLowerBound() {
    return this.niceLowerBound;
  }

  getTickSpacing() {
    return this.tickSpacing;
  }

  setMinMaxPoints(min: number, max: number) {
    this.lowerBound = min;
    this.upperBound = max;
    this.calculate();
  }

  calculate() {
    this.range = this.niceNum(this.upperBound - this.lowerBound, false);
    this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
    this.niceLowerBound =
      Math.floor(this.lowerBound / this.tickSpacing) * this.tickSpacing;
    this.niceUpperBound =
      Math.ceil(this.upperBound / this.tickSpacing) * this.tickSpacing;
  }

  niceNum(range: number, round: boolean) {
    const exponent = Math.floor(Math.log10(range));
    const fraction = range / 10 ** exponent;
    let niceFraction;

    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;

    return niceFraction * 10 ** exponent;
  }
}

export default NiceScale;
