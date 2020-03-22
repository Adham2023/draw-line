<template>
  <div id="app">
    <div class="main">
      
      <div class="canvas-wrapper">
        <!-- <img src="@/assets/star.svg" alt="none"  height="100" width="300"/> -->
      <button :style="'background-color:' + (drawing ? 'green': 'white') + ';' + 'color:' + (drawing ? 'white': 'black')" @click="drawing = !drawing">drawMode</button>
      <button @click="makeLineDashed()">dashed</button>
      <button @click="dottedLine()">dotted</button>
      <button @click="normalLine()">normal</button>
      <button @click="saveAsSvg()">save</button>
      <canvas ref="svg" backgroundColor="grey" ></canvas>
    </div>
    
    <!-- <div class="details-wrapper">
      <p>{{ line}}</p>
      <p> obj: {{ currentObject }}</p>
      <p>drawing: {{ drawing }}</p>
      <p>mouseDown: {{ mouseDown }}</p>
      <p>currentPointerPosition: {{ currentPointerPosition }}</p>
      <p>circlePositions: {{ circlePositions }}</p>
      <p>Moving: {{ objectMoving }}</p>
      <p>ObjectPos: {{ objectPos }}</p>
      <p>deltaXY: {{ deltaXY }}</p> -->
    <!-- <p>Current  Object calcCoords : {{ calcCoordsObject }}</p> -->
      <!-- <vue-json-pretty
        :data="currentPointerPosition"
      >
      </vue-json-pretty>
    </div> -->
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
// import VueJsonPretty from "vue-json-pretty";
import uuid from "uuid";
export default {
  name: "App",
  components: {
    // VueJsonPretty
  },
  mounted() {

    this.canvas = new fabric.Canvas(this.$refs.svg, {
      width: 800,
      height: 500,
      selection: false,
      hoverCursor: "default"
    });
    let line = new fabric.Line([100, 150, 300, 40], {
      strokeWidth: 20,
      stroke: "red",
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      selectable: true,
      perPixelTargetFind: true,
      targetFindTolerance: true
    });
    line.id = uuid();

    let circle2 = new fabric.Circle({
      radius: 5,
      left: 100,
      top: 10,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      fill: "green",
      name: "rightCircle",
      hoverCursor: "e-resize",
      moveCursor: "e-resize"
    });
    let circle1 = new fabric.Circle({
      radius: 5,
      left: 100,
      top: 10,
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      fill: "green",
      name: "leftCircle",
      hoverCursor: "w-resize",
      moveCursor: "w-resize"
    });
    this.circle1 = circle1;
    this.circle2 = circle2;
    this.canvas.add(circle1);
    this.canvas.add(circle2);
    this.canvas.add(line);

    line.fxStraighten({
        onComplete: (e) => {
          console.log('complete', e)
        },
        onChange: (e) => {
          console.log('changed', e)
        },
      })
    line.setCoords()
    this.canvas.renderAll()

    this.line = line;
    this.circle1.set({ visible: false });
    this.circle2.set({ visible: false });
    this.canvas.renderAll();
    this.canvas.on("mouse:down", e => this.onMouseDown(e));
    this.canvas.on("mouse:move", e => this.onMouseMove(e));
    this.canvas.on("mouse:up", () => this.onMouseUp());
    this.canvas.on("selection:created", e => this.createdSelection(e));
    this.canvas.on("object:selected", e => this.objectSelection(e));
    this.canvas.on("mouse:over", e => this.onMouseOver(e));
    this.canvas.on("object:moving", e => this.onObjectMoving(e));
    this.canvas.on("object:rotating", e => this.onObjectRotating(e));
  },
  data() {
    return {
      canvas: null,
      initPoint: { x: 10, y: 10 },
      line: null,
      mouseDown: false,
      drawing: false,
      circle1: null,
      circle2: null,
      currentPointerPosition: { x: 0, y: 0 },
      currentObject: null,
      currentXY: null,
      circlePositions: { x1: 0, y1: 0, x2: 0, y2: 0 },
      objectMoving: false,
      objectPos: { top: 0, left: 0 },
      calcCoordsObject: null,
      deltaXY: null
    };
  },
  methods: {
    dottedLine() {
      this.line.set( {strokeLineCap:"round", strokeDashArray :  [2.5, 35]})
      this.canvas.renderAll()
    },
    normalLine() {
      this.line.set({strokeDashArray: [0, 0]})
      this.canvas.renderAll()
    },
    makeLineDashed() {
      this.line.set( {strokeDashArray :  [10, 10]})
      this.canvas.renderAll()
    },
    saveAsSvg() {
      fabric.log('Normal SVG output: ', this.canvas.toSVG());
    },
    onObjectMoving(e) {
      this.objectMoving = true;
      let { target } = e;
      let { pointer } = e;
      this.currentPointerPosition = pointer;
      this.calcCoordsObject = target.calcCoords(true);
      this.currentObject = e.target;
      console.log("object is moving", e);
    },
    objectSelection(e) {
      this.currentObject = e.target;
      console.log("current  object selected: => ", this.currentObject);
    },
    createdSelection(e) {
      console.log("from selection: ", e);
    },
    onMouseUp() {
      this.mouseDown = false;
      this.deltaXY = {
        dx: this.currentPointerPosition.x - this.currentXY.x,
        dy: this.currentPointerPosition.y - this.currentXY.y
      };
      console.log("mouse up");
      this.objectMoving = false;
      this.circle2.visible = false;
      this.circle1.visible = false;
      this.canvas.renderAll();
      if (this.drawing) {
        this.line.setCoords();
      } else if (this.currentObject.get("type") === "line") {
        this.line.set({
          x1: this.line.x1 + this.deltaXY.dx,
          y1: this.line.y1 + this.deltaXY.dy,
          x2: this.line.x2 + this.deltaXY.dx,
          y2: this.line.y2 + this.deltaXY.dy
        });
        this.line.setCoords();
      }
      this.canvas.renderAll();
    },
    onMouseDown(e) {
      this.mouseDown = true;
      let { target } = e;
      let { pointer } = e;
      if(target) {
        if(e.target.get('type') == 'line') {
          this.circle1.visible = false
          this.circle2.visible = false
          this.canvas.renderAll()
        }
      } 
      else {
        this.currentObject = null
        this.line = null
      } 
      this.currentXY = pointer;
      console.log("mDown ", target);
      if (this.drawing) {
        this.drawLine(e);
      }
    },
    onMouseMove(e) {
      let { target } = e;
      let { pointer } = e;
      if (this.mouseDown && this.drawing) {
        this.line.set({ x2: pointer.x, y2: pointer.y });
        this.line.setCoords();
        this.canvas.renderAll();
      }
      if (!this.drawing) {
        if (this.mouseDown && target && target.get("type") === "circle") {
          console.log(target.name);
          if (target.get("name") === "rightCircle")
            this.line.set({ x2: target.left, y2: target.top });
          if (target.get("name") === "leftCircle")
            this.line.set({ x1: target.left, y1: target.top });
          this.line.setCoords();
          this.canvas.renderAll();
        }
      }
    },
    drawLine(e) {
      let { pointer } = e;
      if (this.drawing) {
        let line = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          {
            strokeWidth: 5,
            stroke: "black",
            originX: "center",
            originY: "center",
            hasControls: false,
            hasBorders: false,
            selectable: true,
            perPixelTargetFind: true,
            targetFindTolerance: true,
            name: "line"
          }
        );
        line.id = uuid();
        this.canvas.add(line);
        this.line = line;
      }
    },
    onMouseOver(e) {
      let { target } = e;
      if (!this.drawing) {
        if (target) {
          if (target.get("type") === "line") {
            this.line = target;
            this.circle2.visible = true;
            this.circle2.set({ left: target.x2, top: target.y2 });
            this.circle1.visible = true;
            this.circle1.set({ left: target.x1, top: target.y1 });
            this.circle2.setCoords();
            this.circle1.setCoords();
            this.circle1.bringToFront()
            this.circle2.bringToFront()
            this.canvas.renderAll();
          }
        }
      }
      console.log("from mouse over: => ", e);
    },
    draw_grid() {
      let options = {
        distance: 10,
        width: this.canvas.width,
        height: this.canvas.height,
        param: {
          stroke: "#ebebeb",
          strokeWidth: 1,
          selectable: false
        }
      }
        let gridLen = options.width / options.distance

      for (var i = 0; i < gridLen; i++) {
        var distance = i * options.distance,
          horizontal = new fabric.Line(
            [distance, 0, distance, options.width],
            options.param
          ),
          vertical = new fabric.Line(
            [0, distance, options.width, distance],
            options.param
          );
        this.canvas.add(horizontal);
        this.canvas.add(vertical);
        if (i % 5 === 0) {
          horizontal.set({ stroke: "#cccccc" });
          vertical.set({ stroke: "#cccccc" });
        }
      }
      this.canvas.renderAll()
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
.details-wrapper {
  flex: 1;
  text-align: left;
  height: 80vh;
  overflow: scroll;
}
.canvas-wrapper {
  border: 1px solid red;
}
</style>
