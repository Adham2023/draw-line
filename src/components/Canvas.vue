<template>
    <div class="canvas-wrapper">
        <p>{{ this.initPoint }}</p>
        <canvas ref="svg" height="500" width="500"></canvas>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { fabric } from "fabric";
import uuid from 'uuid'
export default {
  mounted() {
       this.SET_CANVAS( new fabric.Canvas(this.$refs.svg, {
        selection: false,
        preserveObjectStacking: true
    }));
    this.canvas.on('mouse:down', e => this.onCanvasMouseDown(e))
    this.canvas.on('mouse:move', e => this.onCanvasMouseMove(e))
    this.canvas.on('mouse:up', () => this.onCanvasMouseUp())
    this.canvas.on('selection:created', e => this.onSelectionCreated(e))
    this.canvas.on('selection:updated', e => this.onSelectionUpdated(e))
    this.canvas.on('object:moving', e => this.onObjectMoving(e))
    this.canvas.on('object:scaling', e => this.onObjectScaling(e))
  },
  data() {
    return {
        elem: null,
        initPoint: {x: 0, y: 0}
    };
  },
  computed: {
      ...mapState(['canvas'])
  },
  methods: {
    ...mapActions(["SET_CANVAS", "ADD_TO_CANVAS"]),
    onCanvasMouseDown(e) {
        let { pointer } = e
        this.initPoint = pointer
        console.log(this.initPoint)
        const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        strokeWidth: 2,
        stroke: 'red',
        fill: 'red',
        width: 0,
        height: 0,
        selectable: false,
        hasRotatingPoint: false
        })
        rect.id = uuid();
        this.elem  = rect;
        this.ADD_TO_CANVAS(rect)
        console.log('down: ', e)
    },
    onCanvasMouseMove(e) {
        let { pointer } = e
        this.elem.set({
            width: Math.abs(this.initPoint.x - pointer.x),
            height: Math.abs(this.initPoint.y - pointer.y)
        });
        this.elem.set({ left: Math.min(pointer.x, this.initPoint.x) });
        this.elem.set({ top: Math.min(pointer.y, this.initPoint.y) });
        this.elem.setCoords();
        console.log('move', e)
    },
    onCanvasMouseUp(){
       console.log('up') 
    },
    onSelectionCreated(e) {
        console.log('creted', e)
    },
    onSelectionUpdated(e) {
        console.log('updated', e)
    },
    onObjectMoving(e) {
        console.log('moving', e)
    },
    onObjectScaling(e) {
        console.log('scaling', e)
    }
  }
};
</script>

<style>
canvas {
    background-color: grey;
}
</style>

