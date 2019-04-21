const w : number = window.innerWidth
const h : number = window.innerHeight
const nodes : number = 5
const rects : number = 5
const scGap : number = 0.05
const scDiv : number = 0.51
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#673AB7"
const backColor : string = "#bdbdbd"
const rectSizeFactor : number = 0.66

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number)  : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static scaleFactor(scale : number) : number {
        return Math.floor(scale / scDiv)
    }

    static mirrorValue(scale : number, a : number, b : number) : number {
        const k : number = ScaleUtil.scaleFactor(scale)
        return (1 - k) / a + k / b
    }

    static updateValue(scale : number, dir : number, a : number, b : number) : number {
        return ScaleUtil.mirrorValue(scale, a, b) * dir * scGap
    }
}

class DrawingUtil {

    static drawUpRect(context : CanvasRenderingContext2D, size : number, scale : number) {
        context.fillStyle = foreColor
        context.fillRect(0, -size * scale, size, size * scale)
    }

    static drawRSURNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / sizeFactor
        const rSize : number = size / rectSizeFactor
        const sc1 : number = ScaleUtil.divideScale(scale, 0, 2)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, 2)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        context.save()
        context.translate(gap * (i + 1), h / 2)
        context.rotate(Math.PI/2 * sc2)
        context.strokeRect(-rSize, -rSize, 2 * rSize, 2 * rSize)
        for (var j = 0; j < rects; j++) {
            context.save()
            context.rotate(j * Math.PI / 2)
            context.translate(-size, -size)
            DrawingUtil.drawUpRect(context, size - rSize, ScaleUtil.divideScale(sc1, j, rects))
            context.restore()
        }
        context.restore()
    }
}

class RectSideUpRectStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : RectSideUpRectStage = new RectSideUpRectStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
