type SVGClockOptionsType = {
  notchColor?: string;
  notchBorderColor?: string;
  faceColor?: string;
  hourPointer?: string;
  minutePointer?: string;
  secondsPointer?: string;
}
interface ClockOptions {
  notchColor: string;
  notchBorderColor: string;
  faceColor: string;
  hourPointer: string;
  minutePointer: string;
  secondsPointer: string;
}

class SVGClock {
  readonly #parentId: string;
  readonly #svgElement: SVGSVGElement;
  readonly #width: number;
  readonly #clockOptions: ClockOptions;

  constructor(parentId: string, width: number, options: SVGClockOptionsType) {
    this.#parentId = parentId;
    this.#svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.#width = width;
    this.#clockOptions = { 
      notchColor: options.notchColor ?? "var(--bs-gray-500)",
      notchBorderColor: options.notchBorderColor ?? "var(--bs-border-color-translucent)",
      faceColor: options.faceColor ?? "rgba(var(--bs-warning-rgb),0.2)",
      hourPointer: options.hourPointer ?? "#0000ff",
      minutePointer: options.minutePointer ?? "#0000ff",
      secondsPointer: options.secondsPointer ?? "#0000ff"
    };

    const wrapper = document.createElement("div");
    wrapper.style.height = `${this.#width}px`;
    wrapper.appendChild(this.#svgElement);

    const clock = document.getElementById(this.#parentId);
    if (!clock) {
      document.body.appendChild(wrapper);
    }
    else {
      clock.appendChild(wrapper);
    }

    this.init();
  }

  init(){
    this.#svgElement.style.width = `${this.#width}px`;
    this.#svgElement.style.height = `${this.#width}px`;
    this.#svgElement.setAttribute('width', `${this.#width}`);
    this.#svgElement.setAttribute('height', `${this.#width}`);

    const gray500 = this.#clockOptions.notchColor;
    const notchWidth = `${Math.floor(this.#width / 50)}`;
    const face_r = Math.floor(this.#width / 5);
    const notch_r = face_r + Math.floor(face_r / 6);

    // face - számlap
    this.SVGCircle(notch_r, undefined, undefined, this.#clockOptions.notchBorderColor);
    this.SVGLine(notch_r, 0, gray500, notchWidth);
    this.SVGLine(notch_r, 30, gray500, notchWidth);
    this.SVGLine(notch_r, 60, gray500, notchWidth);
    this.SVGLine(notch_r, 90, gray500, notchWidth);
    this.SVGLine(notch_r, 120, gray500, notchWidth);
    this.SVGLine(notch_r, 150, gray500, notchWidth);
    this.SVGLine(notch_r, 180, gray500, notchWidth);
    this.SVGLine(notch_r, 210, gray500, notchWidth);
    this.SVGLine(notch_r, 240, gray500, notchWidth);
    this.SVGLine(notch_r, 270, gray500, notchWidth);
    this.SVGLine(notch_r, 300, gray500, notchWidth);
    this.SVGLine(notch_r, 330, gray500, notchWidth);
    this.SVGCircle(face_r, undefined, undefined, "white");
    this.SVGCircle(face_r, undefined, undefined, this.#clockOptions.faceColor);
    
    // pointers - mutatók
    const minute_r = Math.floor(face_r * 0.9);
    const hour_r = Math.floor(face_r * 2 / 3 );
    this.SVGLine(minute_r, 0, undefined, "3");
    this.SVGLine(hour_r, 90, undefined, "6");
    this.SVGLine(face_r, 150, undefined, "1");

    const setSVGClock = (forceHourAndMinute: boolean|undefined) => {
      const {hour, minute, seconds, realHour} = this.getNow();
      const secondsLine = this.#svgElement.children[17] as SVGLineElement;
      const { x2, y2 } = this.getSVGLineEndpoints(face_r, 360 * (seconds / 60));
      if (!/NaN/.test(`${x2}${y2}`)) {
        secondsLine.setAttribute('x2', `${x2}`);
        secondsLine.setAttribute('y2', `${y2}`);
      }
      if (forceHourAndMinute || seconds === 0) {
        // set hour and minute
        const minuteLine = this.#svgElement.children[15] as SVGLineElement;
        const hourLine = this.#svgElement.children[16] as SVGLineElement;
        const mCoord = this.getSVGLineEndpoints(minute_r, 360 * (minute / 60));
        const hCoord = this.getSVGLineEndpoints(hour_r, (360 * (hour / 12)) + ((360 / 12) * (minute / 60)));
        minuteLine.setAttribute('x2', `${mCoord.x2}`);
        minuteLine.setAttribute('y2', `${mCoord.y2}`);
        hourLine.setAttribute('x2', `${hCoord.x2}`);
        hourLine.setAttribute('y2', `${hCoord.y2}`);
      }
    };
    let secondsIntervalID = setInterval(setSVGClock, 1000);
    let minuteIntervalID = setInterval(() => setSVGClock(true), 60 * 1000);
    setSVGClock(true);
  }

  SVGCircle(
    r: number,
    stroke: string|undefined,
    strokeWidth: string|undefined,
    fill: string|undefined
  ){
    const cx: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width 
    const cy: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    if (fill) circle.style.fill = fill;
    if (stroke) circle.style.stroke = stroke;
    if (strokeWidth) circle.style.strokeWidth = strokeWidth;
    circle.setAttribute('cx', `${cx}`);
    circle.setAttribute('cy', `${cy}`);
    circle.setAttribute('r', `${r}`);
    this.#svgElement.append(circle);
  }

  getSVGLineEndpoints(
    length: number, 
    degrees: number
  ){
    const x1: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width 
    const y1: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width
    const x1EndPoint = 0;
    const y1EndPoint = 0 - length;
    const rad = Math.PI / 180.0;
    let x2 = x1EndPoint * Math.cos(degrees * rad) - y1EndPoint * Math.sin(degrees * rad);
    let y2 = x1EndPoint * Math.sin(degrees * rad) + y1EndPoint * Math.cos(degrees * rad);
    x2 += x1;
    y2 += y1;
    return {x2, y2};
  }

  SVGLine(
    length: number, 
    degrees: number, 
    stroke: string|undefined, 
    width: string|undefined
  ){
    const x1: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width 
    const y1: number = Math.floor(this.#width / 2 / 10) * 10; // origo - half width
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.style.stroke = stroke ?? "#0000ff";
    line.style.strokeWidth = width ?? "6";
    line.setAttribute('x1', `${x1}`);
    line.setAttribute('y1', `${y1}`);
    const { x2, y2 } = this.getSVGLineEndpoints(length, degrees);
    line.setAttribute('x2', `${x2}`);
    line.setAttribute('y2', `${y2}`);
    this.#svgElement.append(line);
  }

  getNow(){
    const now = new Date();
    const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    return { hour, minute, seconds, realHour: now.getHours() };
  }
}

export default SVGClock;