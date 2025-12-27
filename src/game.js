// import './style.css'

export class Game {
    constructor(canvasElement) {
        this.board = canvasElement
        this.ctx = this.board.getContext("2d")
        this.pawnColors = ["#ff0000", "#00ff00", "#0000ff", "#ffd500", "#7641c4", "#7e3a09", "#ee00ff", "#00c4ff"]
        this.sample = [-1,-1,-1,-1,-1]
        this.question = []
        this.responses = []
        this.tryNumber = 1
        this.isDragging = false
        this.draggedPawnIdx = -1
        this.mousePos = { x: 0, y: 0 }
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
    }

    destroy() {
        this.board.removeEventListener('mousedown', this.handleMouseDown)
        window.removeEventListener('mousemove', this.handleMouseMove)
        window.removeEventListener('mouseup', this.handleMouseUp)
    }

    run () {
        const modal = document.querySelector('.modal')
        if(modal) modal.parentElement.removeChild(modal.parentElement.lastChild)
        this.board.height = 100
        this.question = [0,1,2,3,4,5,6,7].sort(() => Math.random() - 0.5).slice(0, 5)
        this.responses = []
        this.tryNumber = 1

        this.drawSample()
        this.drawPawns()
        this.board.addEventListener('click', (e) => this.boardClick(e))

        this.board.addEventListener('mousedown', this.handleMouseDown)
        window.addEventListener('mousemove', this.handleMouseMove)
        window.addEventListener('mouseup', this.handleMouseUp)

        this.render()
    }

    getMousePos(event) {
        const rect = this.board.getBoundingClientRect()
        const ratio = this.board.width / rect.width
        return {
            x: (event.clientX - rect.left) * ratio,
            y: (event.clientY - rect.top) * ratio
        }
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e)
        const yPawns = this.board.height - 30

        for (let i = 0; i < 8; i++) {
            const xPawn = 50 + i * 35
            const dist = Math.sqrt((pos.x - xPawn) ** 2 + (pos.y - yPawns) ** 2)
            if (dist < 15) {
                this.isDragging = true
                this.draggedPawnIdx = i
                this.mousePos = pos
                return
            }
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return
        this.mousePos = this.getMousePos(e)
        this.render()
    }

    handleMouseUp(e) {
        if (!this.isDragging) return

        const pos = this.getMousePos(e)
        const ySample = this.board.height - 70

        for (let i = 0; i < 5; i++) {
            const xSample = 50 + i * 35
            const dist = Math.sqrt((pos.x - xSample) ** 2 + (pos.y - ySample) ** 2)
            if (dist < 20) {
              this.sample[i] = this.draggedPawnIdx
              break
            }
        }

      this.isDragging = false
        this.draggedPawnIdx = -1
        this.render()
    }

    render() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height)

        this.drawBoard()
        this.drawResult()
        this.drawPawns()
        this.drawSample()
        if (this.isDragging && this.draggedPawnIdx !== -1) {
            this.drawPawn(this.mousePos.x, this.mousePos.y, this.pawnColors[this.draggedPawnIdx])
        }
    }

    boardClick(event) {
        const boardRect = this.board.getBoundingClientRect()
        const ratio = boardRect.width / this.board.width
        const pos = {
            x: event.clientX - boardRect.left,
            y: event.clientY - boardRect.top
        }
        let checkRect = {
            xMin: 240 * ratio,
            yMin: (this.board.height - 85) * ratio,
            xMax: (240 + 150) * ratio,
            yMax: (this.board.height - 55) * ratio
        }
        if (this.inBound(checkRect, pos)) {
            this.checkSample()
        }
    }

    inBound(rect, pos) {
        return pos.x > rect.xMin && pos.x < rect.xMax && pos.y > rect.yMin && pos.y < rect.yMax
    }

    checkSample() {
        if(this.sample.find(s => s === -1)) return
        const response = [-1, -1, -1, -1, -1]
        this.board.height += 50
        for(let i = 0; i < 5; i++) {
            if(this.sample[i] === this.question[i]) {
                response[i] = 1
            } else if(0 <= this.question.findIndex(q => q === this.sample[i])) {
                response[i] = 0
            } else {
                response[i] = -1
            }
        }
        this.responses.push({
            sample: [...this.sample],
            result: [...response]
        })
        this.tryNumber++
        this.sample = [-1,-1,-1,-1,-1]
        this.render()
        if(response.filter(r => r === 1).length === 5) {
            this.endGame()
        }
    }

    endGame() {
        const modal = document.createElement('div')
        const content = document.createElement('div')
        const text = document.createElement('span')
        const button = document.createElement('button')

        modal.setAttribute('data-game-modal', 'true')
        Object.assign(modal.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${this.board.width}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '15px',
            zIndex: '1000',
            borderRadius: '20px'
        })

        Object.assign(content.style, {
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            border: '3px solid #5d2e46'
        })

        text.textContent = 'You win!!!'
        Object.assign(text.style, {
            fontSize: '28px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: '#5d2e46'
        })

        button.textContent = 'Next Game'
        Object.assign(button.style, {
            padding: '12px 24px',
            backgroundColor: '#5d2e46',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
        })

        button.onmouseover = () => button.style.backgroundColor = '#7a3d5c'
        button.onmouseout = () => button.style.backgroundColor = '#5d2e46'

        button.onclick = () => {
            modal.remove()
            this.run()
        }

        content.appendChild(text)
        content.appendChild(button)
        modal.appendChild(content)

        this.board.parentElement.style.position = 'relative'
        this.board.parentElement.appendChild(modal)
    }

    drawBoard() {
        const x = 0
        const y = 0
        const w = this.board.width
        const h = this.board.height
        const r = 20

        this.ctx.beginPath()
        this.ctx.roundRect(x, y, w, h, r)
        const mainGradient = this.ctx.createLinearGradient(0, 0, 0, h)
        mainGradient.addColorStop(0, "#6b3350")
        mainGradient.addColorStop(1, "#432132")
        this.ctx.fillStyle = mainGradient
        this.ctx.fill()

        this.ctx.shadowBlur = 0
        this.ctx.shadowOffsetY = 0

        this.ctx.lineWidth = 4
        this.ctx.beginPath()
        this.ctx.roundRect(x + 2, y + 2, w - 4, h - 4, r)

        const bevelGradient = this.ctx.createLinearGradient(0, 0, w, h)
        bevelGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
        bevelGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
        bevelGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')

        this.ctx.strokeStyle = bevelGradient
        this.ctx.stroke()

        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.roundRect(x + 5, y + 5, w - 10, h - 10, r - 5)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        this.ctx.stroke()
    }

    drawPawns() {
        const y = this.board.height - 30
        for(let i = 0; i < 8; i++) {
            this.drawPawn(50 + i * 35, y, this.pawnColors[i])
        }
    }

    drawSample() {
        const y = this.board.height - 70
        for(let i = 0; i < 5; i++) {
            if(this.sample[i] === -1) {
                this.drawHole(50 + i * 35, y)
            } else {
                this.drawPawn(50 + i * 35, y, this.pawnColors[this.sample[i]])
            }
        }
        this.ctx.fillStyle = "#aaa"
        this.ctx.beginPath()
        this.ctx.roundRect(240,y - 15,150, 30, 10)
        this.ctx.fill()
        this.ctx.fillStyle = "#fff"
        this.ctx.font = "30px Arial"
        this.ctx.fillText("Check", 270, y + 10)
    }

    drawHole(x, y) {
        const radius = 15
        const color = "#a0a0a0"
        this.ctx.beginPath()
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
        this.ctx.strokeStyle = color
        this.ctx.stroke()
    }

    drawPawn(x, y, color) {
        const radius = 15
        const gradient = this.ctx.createRadialGradient(x - radius/4, y - radius/4, 2, x, y, radius)
        gradient.addColorStop(0, "#ffffff")
        gradient.addColorStop(0.5, color)
        this.ctx.beginPath()
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
        this.ctx.fillStyle = gradient
        this.ctx.strokeStyle = color
        this.ctx.fill()
        this.ctx.stroke()
    }

    drawResponse(idx, response) {
        for(let [i, r] of response.sort().reverse().entries()) {
            if (r === 1) {
                this.drawPawn(240 + i * 35, 30 + idx * 40, "#111")
            } else if (r === 0) {
                this.drawPawn(240 + i * 35, 30 + idx * 40, "#eee")
            }
        }
    }

    drawResult() {
        for(let [idx, r] of this.responses.entries()) {
            for(let i = 0; i < 5; i++) {
                this.drawPawn((50 + i * 35), 30 + idx * 40, this.pawnColors[r.sample[i]])
            }
            this.drawResponse(idx, r.result)
        }
    }
}
