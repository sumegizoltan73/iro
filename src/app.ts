import { ajax } from "rxjs/ajax";
import { map } from "rxjs";

export type PostItemType = {
  title: string;
  content: string;
  modified: string;
};

export type PostListType = {
  result: string;
  posts: PostItemType[];
};

const getPostList = () => {
  const apikey = `key`;
  const title = "cv";
  //return ajax(`/api/PostsFromCMS.php?apikey=cms${apikey}75&title=${title}`).pipe(
  return ajax(`https://www.iro.info.hu/api/PostsFromCMS.php?apikey=cms${apikey}75&title=${title}`).pipe(
    map(response => (response.response as PostListType))
  );
};

customElements.define(
  "table-of-content",
  class extends HTMLElement {
    constructor() {
      super();
      let template = document.getElementById("root");
      if (!template) { 
        template = document.createElement("div");
        document.body.appendChild(template);
      }
      const textBefore = document.createElement("b");
      textBefore.appendChild(document.createTextNode("Tartalomjegyzék"));
      const container = document.createElement("div");
      container.appendChild(textBefore);
      const tocDiv = document.getElementById("toc");
      if (tocDiv) {
        tocDiv.className = "toc";
        tocDiv.appendChild(container);
      }
      this.setParsedHead(template, container, ["h1", "h2", "h3", "h4", "h5", "h6"]);
    }

    setParsedHead(node: Node, container: Node, tagNames: string[]) {
      let collections: any = { };
      let map: RegExpStringIterator<RegExpExecArray>;
      for (const tag of tagNames) {
        collections[tag] = (<HTMLElement>node).getElementsByTagName(tag);
      }
      const regexp = new RegExp(/<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>/g);
      map = (<HTMLElement>node).innerHTML.matchAll(regexp);
      for (const regexpItem of map) {
        const tag = regexpItem[0].replace("<\/", "").replace(">", "");
        const tagIndex = collections[`${tag}Index`] ?? 0;
        const head = collections[tag][tagIndex];
        (<HTMLElement>container).appendChild((<HTMLElement>head).cloneNode(true));
        collections[`${tag}Index`] = tagIndex + 1;
      }
    }
  },
);

function setPostList(part: PostListType){
  const root = document.getElementById("root");
  if (!root) return;
  
  for (const element of part.posts) {
    const wrapper = document.createElement("div");
    wrapper.className = "card";
    root.appendChild(wrapper);
    const cardbody = document.createElement("div");
    cardbody.className = "card-body";
    wrapper.appendChild(cardbody);
    const head = document.createElement("h2");
    head.className = "card-title";
    head.innerHTML = element.title.replace("CV ", "");
    cardbody.appendChild(head);
    const container = document.createElement("div");
    container.className = "container";
    container.innerHTML = element.content;
    cardbody.appendChild(container);
    const modified = document.createElement("div");
    modified.innerHTML = element.modified;
    cardbody.appendChild(modified);
  }

  document.createElement("table-of-content");
}

function handleClockInterval() {
  let hour: number = 12;
  let minute: number = 15;
  let seconds: number;
  const now = new Date();
  hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
  minute = now.getMinutes();
  seconds = now.getSeconds();
  setClock(hour, minute, seconds, now.getHours());
}
function handleSecondsInterval() {
  let seconds: number;
  const now = new Date();
  seconds = now.getSeconds();
  setSeconds(seconds);
  if (seconds === 15) { 
    handleClockInterval();
  }
}
function setClock(hour: number, minute: number, seconds: number, realHour: number) {
  const rotateHour = ((360 / 12) * hour) + ((360 / 12) * (minute / 60));
  const rotateMinute = (360 / 60) * minute;
  const rotateSeconds = (360 / 60) * seconds;
  const clockDiv = document.getElementById("clock");
  const bigPointer = clockDiv?.children[0];
  const smallPointer = clockDiv?.children[1];
  const secondsPointer = clockDiv?.children[2];
  const text = clockDiv?.children[3];
  if (bigPointer && smallPointer && secondsPointer && text) {
    (<HTMLAnchorElement>bigPointer).style.rotate = `${rotateMinute + 90}deg`;
    (<HTMLAnchorElement>smallPointer).style.rotate = `${rotateHour + 90}deg`;
    (<HTMLSpanElement>secondsPointer).style.rotate = `${rotateSeconds + 90}deg`;
    (<HTMLSpanElement>text).innerHTML = `A pontos idő <b>${realHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}</b>.`;
  }
}
function setSeconds(seconds: number) {
  const rotateSeconds = (360 / 60) * seconds;
  const clockDiv = document.getElementById("clock");
  const secondsPointer = clockDiv?.children[2];
  if (secondsPointer) {
    (<HTMLSpanElement>secondsPointer).style.rotate = `${rotateSeconds + 90}deg`;
  }
}

function SVGClock(){
  const svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.width = "300px";
  svg.style.height = "300px";
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '300');
  SVGCircle(svg, 150, 150, 70, undefined, undefined, "var(--bs-border-color-translucent)");
  SVGLine(svg, 150, 150, 70, 0, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 30, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 60, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 90, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 120, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 150, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 180, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 210, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 240, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 270, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 300, "var(--bs-gray-500)", undefined);
  SVGLine(svg, 150, 150, 70, 330, "var(--bs-gray-500)", undefined);
  SVGCircle(svg, 150, 150, 60, undefined, undefined, "white");
  SVGCircle(svg, 150, 150, 60, undefined, undefined, "rgba(var(--bs-warning-rgb),0.2)");
  
  const wrapper = document.createElement("div");
  wrapper.style.height = "300px";
  wrapper.appendChild(svg);
  document.body.appendChild(wrapper);

  // x' = x cos (fi) - y sin (fi)
  // y' = x sin (fi) + y cos (fi)
}
function SVGCircle(
    svg: SVGSVGElement, 
    cx: number, 
    cy: number, 
    r: number,
    stroke: string|undefined,
    strokeWidth: string|undefined,
    fill: string|undefined
  ){
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  if (fill) circle.style.fill = fill;
  if (stroke) circle.style.stroke = stroke;
  if (strokeWidth) circle.style.strokeWidth = strokeWidth;
  circle.setAttribute('cx', `${cx}`);
  circle.setAttribute('cy', `${cy}`);
  circle.setAttribute('r', `${r}`);
  svg.append(circle);
}
function SVGLine(
    svg: SVGSVGElement, 
    x1: number, 
    y1: number, 
    length: number, 
    degrees: number, 
    stroke: string|undefined, 
    width: string|undefined
  ){
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.style.stroke = stroke ?? "#0000ff";
  line.style.strokeWidth = width ?? "6";
  line.setAttribute('x1', `${x1}`);
  line.setAttribute('y1', `${y1}`);
  const x1EndPoint = 0;
  const y1EndPoint = 0 - length;
  const rad = Math.PI / 180.0;
  console.log(degrees, degrees * rad);
  const x2 = x1EndPoint * Math.cos(degrees * rad) - y1EndPoint * Math.sin(degrees * rad);
  const y2 = x1EndPoint * Math.sin(degrees * rad) + y1EndPoint * Math.cos(degrees * rad);
  line.setAttribute('x2', `${x2 + x1}`);
  line.setAttribute('y2', `${y2 + y1}`);
  svg.append(line);
}

window.onload = function() {
  const root = document.getElementById("root");
  if (!root) return;

  const postlist$ = getPostList();
  postlist$.subscribe(part => {
    setPostList(part);
  });

  setTimeout(() => document.body.classList.add("showing"), 100);
  setTimeout(() => document.body.classList.add("reading"), 1100);

  handleClockInterval();
  //const clockIntervalID = setInterval(handleClockInterval, (1000 * 60));
  const secondsIntervalID = setInterval(handleSecondsInterval, 1000);

  SVGClock();
};