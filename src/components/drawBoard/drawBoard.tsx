import * as assign from 'object-assign';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import IJoker from '../../models/joker';

interface IDrawBoardProps {
  brushColor?: string;
  canvasStyle?: any;
  cursor?: string;
  lineWidth?: number;
  joker: IJoker;
  drawnOn: () => void;
}

interface IDrawBoardState {
  canvas: any;
  context: any;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
  lastDrawingX: number;
  drawing: boolean;
}

function verifiyVerticalLine(startX: number, lastX: number, startY: number, lastY: number, lastDrawingX: number) {
  return (Math.abs(startX - lastX) < 5 && Math.abs(startY - lastY) > 20)
    && verifiyVerticalLinePosition(startX, lastX, lastDrawingX);
}

function verifiyHorizontalLine(startX: number, lastX: number, startY: number, lastY: number, lastDrawingX: number) {
  return (Math.abs(startX - lastX) > 25 && Math.abs(startX - lastX) < 60 && Math.abs(startY - lastY) > 15 && Math.abs(startY - lastY) < 40)
    && verifiyHorizontalLinePosition(startX, lastX, lastDrawingX);
}

function verifiyVerticalLinePosition(startX: number, lastX: number, lastDrawingX: number) {
  return startX > lastDrawingX - 10 && startX < lastDrawingX + 60 && lastX > lastDrawingX - 10  && lastX < lastDrawingX + 60;
}

function verifiyHorizontalLinePosition(startX: number, lastX: number, lastDrawingX: number) {
  return startX > lastDrawingX - 80 && startX < lastDrawingX + 30 && lastX < lastDrawingX + 30  && lastX > lastDrawingX - 80;
}

class DrawBoard extends React.Component<IDrawBoardProps, IDrawBoardState> {
  private static getDefaultStyle() {
    return {
      brushColor: '#FFFF00',
      canvasStyle: {
        backgroundColor: '#00FFDC'
      },
      clear: false,
      cursor: 'pointer',
      lineWidth: 4,
    };
  }
  
  public readonly state: IDrawBoardState = {
    canvas: null,
    context: null,
    drawing: false,
    lastDrawingX: 0,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
  }

  private touchInProgress: any;

  constructor(props: IDrawBoardProps) {
    super(props);

    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleonMouseUp = this.handleonMouseUp.bind(this);
    this.drawContent = this.drawContent.bind(this);
    this.drawCanvas = this.drawCanvas.bind(this);
  }

  public componentDidMount() {
    this.drawCanvas();

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("orientationchange", this.handleResize);
  }

  public componentDidUpdate(prevProps: IDrawBoardProps) {
    if (prevProps.joker.counter !== this.props.joker.counter) {
      this.resetCanvas();
    }
  }

  public render() {
    return (
      <canvas style = {this.canvasStyle()}
        onMouseDown = {this.handleOnMouseDown}
        onTouchStart = {this.handleOnTouchStart}
        onMouseMove = {this.handleOnMouseMove}
        onMouseUp = {this.handleonMouseUp}
        onTouchEnd = {this.handleOnTouchEnd}
      />
    );
  }

  private handleResize = () => {
    this.drawCanvas();
  }

  private drawCanvas(){
    const canvas: any = ReactDOM.findDOMNode(this);

    canvas.style.width = '100%';
    canvas.width = canvas.offsetWidth;

    let numberOfLinesPerRow = 0;
    let rowHeight = 0;

    if (window.outerWidth < 650) {
      numberOfLinesPerRow = Math.floor((window.outerWidth - 220) / 35) * 5;
      rowHeight = 35;
    }
    else {
      numberOfLinesPerRow = Math.floor((window.outerWidth - 300) / 60) * 5;
      rowHeight = 50;
    }
    const numberOfRowsToDraw = Math.ceil(this.props.joker.counter / numberOfLinesPerRow) + 1;

    canvas.style.height = `${numberOfRowsToDraw * rowHeight}px`;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');

    this.setState({
      canvas,
      context
    }, () => this.drawContent());
  }

  private handleOnTouchStart (e: any) {
    this.touchInProgress = setTimeout(() => this.props.drawnOn(), 2000);
  }

  private handleOnTouchEnd (e: any) {
    clearTimeout(this.touchInProgress);
  }

  private handleOnMouseDown(e: any){
    const rect = this.state.canvas.getBoundingClientRect();
    this.state.context.beginPath();

    this.setState({
      drawing: true,
      lastX: e.clientX - rect.left,
      lastY: e.clientY - rect.top,
      startX: e.clientX - rect.left,
      startY : e.clientY - rect.top,
    });
  }

  private handleOnMouseMove(e: any) {  
    if(this.state.drawing){
      const rect = this.state.canvas.getBoundingClientRect();
      const lastX = this.state.lastX;
      const lastY = this.state.lastY;
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      this.draw(lastX, lastY, currentX, currentY);
      this.setState({
        lastX: currentX,
        lastY: currentY
      });
    }
  }

  private handleonMouseUp() {
    const { startX, lastX, startY, lastY, lastDrawingX } = this.state;
    
    this.setState({
      drawing: false
    });

    if (verifiyVerticalLine(startX, lastX, startY, lastY, lastDrawingX) ||
      verifiyHorizontalLine(startX, lastX, startY, lastY, lastDrawingX)) {
      this.props.drawnOn();
    } else {
      this.resetCanvas();
    }
  }

  private draw(lX: number, lY: number, cX: number, cY: number) {
    const newContext = this.state.context;
    newContext.strokeStyle = this.props.brushColor;
    newContext.lineWidth = this.props.lineWidth;
    this.setState({
      context: newContext
    });
    this.state.context.moveTo(lX, lY);
    this.state.context.lineTo(cX, cY);
    this.state.context.stroke();
  }

  private resetCanvas(){
    const width = this.state.context.canvas.width;
    const height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
    this.drawContent();
  }

  private drawContent() {
    const { joker } = this.props;
    const { context } = this.state;
    let scale = 1;
    if (window.outerWidth < 650) {
      scale = 0.65;
    }

    const fontSize = 40 * (scale);
    const startX = 20 * scale;
    const startY = 50 * scale;
    let currentY = startY;
    let currentX = startX;
    currentX = startX;
 
    context.font = `${fontSize}px Annie Use Your Telescope`;
    context.fillText(joker.name, currentX, currentY);
    currentX = currentX + (200 * scale);
    for(let i=0;i<joker.counter;i++) {
      if ((i + 1) % 5 !== 0) {
        currentX = currentX + (15 * scale);
        context.beginPath();
        context.moveTo(currentX, currentY);
        context.lineTo(currentX, currentY - (40 * scale));
        context.stroke();
      } else {
        context.beginPath();
        context.moveTo(currentX - (50 * scale) , currentY - (40 * scale));
        context.lineTo(currentX + (5 * scale), currentY);
        context.stroke();
        if ((this.state.context.canvas.width - 10) < currentX + (50 * scale)) {
          currentX = startX + (200 * scale);
          currentY = currentY + (45 * scale);
        }
      }
    }

    context.height = currentY;

    this.setState({
      context,
      lastDrawingX: currentX,
    });
  }

  private canvasStyle(){
    const defaults = DrawBoard.getDefaultStyle();
    const custom = this.props.canvasStyle;

    return assign({}, defaults, custom);
  }
}

export default DrawBoard;