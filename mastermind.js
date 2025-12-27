class h {
  constructor(e) {
    this.board = e, this.ctx = this.board.getContext("2d"), this.pawnColors = ["#ff0000", "#00ff00", "#0000ff", "#ffd500", "#7641c4", "#7e3a09", "#ee00ff", "#00c4ff"], this.sample = [-1, -1, -1, -1, -1], this.question = [], this.responses = [], this.tryNumber = 1, this.isDragging = !1, this.draggedPawnIdx = -1, this.mousePos = { x: 0, y: 0 }, this.handleMouseDown = this.handleMouseDown.bind(this), this.handleMouseMove = this.handleMouseMove.bind(this), this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  destroy() {
    this.board.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("mousemove", this.handleMouseMove), window.removeEventListener("mouseup", this.handleMouseUp);
  }
  run() {
    const e = document.querySelector(".modal");
    e && e.parentElement.removeChild(e.parentElement.lastChild), this.board.height = 100, this.question = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5).slice(0, 5), this.responses = [], this.tryNumber = 1, this.drawSample(), this.drawPawns(), this.board.addEventListener("click", (t) => this.boardClick(t)), this.board.addEventListener("mousedown", this.handleMouseDown), window.addEventListener("mousemove", this.handleMouseMove), window.addEventListener("mouseup", this.handleMouseUp), this.render();
  }
  getMousePos(e) {
    const t = this.board.getBoundingClientRect(), s = this.board.width / t.width;
    return {
      x: (e.clientX - t.left) * s,
      y: (e.clientY - t.top) * s
    };
  }
  handleMouseDown(e) {
    const t = this.getMousePos(e), s = this.board.height - 30;
    for (let i = 0; i < 8; i++) {
      const o = 50 + i * 35;
      if (Math.sqrt((t.x - o) ** 2 + (t.y - s) ** 2) < 15) {
        this.isDragging = !0, this.draggedPawnIdx = i, this.mousePos = t;
        return;
      }
    }
  }
  handleMouseMove(e) {
    this.isDragging && (this.mousePos = this.getMousePos(e), this.render());
  }
  handleMouseUp(e) {
    if (!this.isDragging) return;
    const t = this.getMousePos(e), s = this.board.height - 70;
    for (let i = 0; i < 5; i++) {
      const o = 50 + i * 35;
      if (Math.sqrt((t.x - o) ** 2 + (t.y - s) ** 2) < 20) {
        this.sample[i] = this.draggedPawnIdx;
        break;
      }
    }
    this.isDragging = !1, this.draggedPawnIdx = -1, this.render();
  }
  render() {
    this.ctx.clearRect(0, 0, this.board.width, this.board.height), this.drawBoard(), this.drawResult(), this.drawPawns(), this.drawSample(), this.isDragging && this.draggedPawnIdx !== -1 && this.drawPawn(this.mousePos.x, this.mousePos.y, this.pawnColors[this.draggedPawnIdx]);
  }
  boardClick(e) {
    const t = this.board.getBoundingClientRect(), s = t.width / this.board.width, i = {
      x: e.clientX - t.left,
      y: e.clientY - t.top
    };
    let o = {
      xMin: 240 * s,
      yMin: (this.board.height - 85) * s,
      xMax: 390 * s,
      yMax: (this.board.height - 55) * s
    };
    this.inBound(o, i) && this.checkSample();
  }
  inBound(e, t) {
    return t.x > e.xMin && t.x < e.xMax && t.y > e.yMin && t.y < e.yMax;
  }
  checkSample() {
    if (this.sample.find((t) => t === -1)) return;
    const e = [-1, -1, -1, -1, -1];
    this.board.height += 50;
    for (let t = 0; t < 5; t++)
      this.sample[t] === this.question[t] ? e[t] = 1 : 0 <= this.question.findIndex((s) => s === this.sample[t]) ? e[t] = 0 : e[t] = -1;
    this.responses.push({
      sample: [...this.sample],
      result: [...e]
    }), this.tryNumber++, this.sample = [-1, -1, -1, -1, -1], this.render(), e.filter((t) => t === 1).length === 5 && this.endGame();
  }
  endGame() {
    const e = document.createElement("div"), t = document.createElement("div"), s = document.createElement("span"), i = document.createElement("button");
    e.setAttribute("data-game-modal", "true"), Object.assign(e.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: `${this.board.width}px`,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: "15px",
      zIndex: "1000",
      borderRadius: "20px"
    }), Object.assign(t.style, {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      border: "3px solid #5d2e46"
    }), s.textContent = "You win!!!", Object.assign(s.style, {
      fontSize: "28px",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      color: "#5d2e46"
    }), i.textContent = "Next Game", Object.assign(i.style, {
      padding: "12px 24px",
      backgroundColor: "#5d2e46",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold"
    }), i.onmouseover = () => i.style.backgroundColor = "#7a3d5c", i.onmouseout = () => i.style.backgroundColor = "#5d2e46", i.onclick = () => {
      e.remove(), this.run();
    }, t.appendChild(s), t.appendChild(i), e.appendChild(t), this.board.parentElement.style.position = "relative", this.board.parentElement.appendChild(e);
  }
  drawBoard() {
    const s = this.board.width, i = this.board.height, o = 20;
    this.ctx.beginPath(), this.ctx.roundRect(0, 0, s, i, o);
    const n = this.ctx.createLinearGradient(0, 0, 0, i);
    n.addColorStop(0, "#6b3350"), n.addColorStop(1, "#432132"), this.ctx.fillStyle = n, this.ctx.fill(), this.ctx.shadowBlur = 0, this.ctx.shadowOffsetY = 0, this.ctx.lineWidth = 4, this.ctx.beginPath(), this.ctx.roundRect(2, 2, s - 4, i - 4, o);
    const a = this.ctx.createLinearGradient(0, 0, s, i);
    a.addColorStop(0, "rgba(255, 255, 255, 0.3)"), a.addColorStop(0.5, "rgba(0, 0, 0, 0)"), a.addColorStop(1, "rgba(0, 0, 0, 0.5)"), this.ctx.strokeStyle = a, this.ctx.stroke(), this.ctx.lineWidth = 1, this.ctx.beginPath(), this.ctx.roundRect(5, 5, s - 10, i - 10, o - 5), this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)", this.ctx.stroke();
  }
  drawPawns() {
    const e = this.board.height - 30;
    for (let t = 0; t < 8; t++)
      this.drawPawn(50 + t * 35, e, this.pawnColors[t]);
  }
  drawSample() {
    const e = this.board.height - 70;
    for (let t = 0; t < 5; t++)
      this.sample[t] === -1 ? this.drawHole(50 + t * 35, e) : this.drawPawn(50 + t * 35, e, this.pawnColors[this.sample[t]]);
    this.ctx.fillStyle = "#aaa", this.ctx.beginPath(), this.ctx.roundRect(240, e - 15, 150, 30, 10), this.ctx.fill(), this.ctx.fillStyle = "#fff", this.ctx.font = "30px Arial", this.ctx.fillText("Check", 270, e + 10);
  }
  drawHole(e, t) {
    const i = "#a0a0a0";
    this.ctx.beginPath(), this.ctx.arc(e, t, 15, 0, 2 * Math.PI), this.ctx.strokeStyle = i, this.ctx.stroke();
  }
  drawPawn(e, t, s) {
    const o = this.ctx.createRadialGradient(e - 3.75, t - 3.75, 2, e, t, 15);
    o.addColorStop(0, "#ffffff"), o.addColorStop(0.5, s), this.ctx.beginPath(), this.ctx.arc(e, t, 15, 0, 2 * Math.PI), this.ctx.fillStyle = o, this.ctx.strokeStyle = s, this.ctx.fill(), this.ctx.stroke();
  }
  drawResponse(e, t) {
    for (let [s, i] of t.sort().reverse().entries())
      i === 1 ? this.drawPawn(240 + s * 35, 30 + e * 40, "#111") : i === 0 && this.drawPawn(240 + s * 35, 30 + e * 40, "#eee");
  }
  drawResult() {
    for (let [e, t] of this.responses.entries()) {
      for (let s = 0; s < 5; s++)
        this.drawPawn(50 + s * 35, 30 + e * 40, this.pawnColors[t.sample[s]]);
      this.drawResponse(e, t.result);
    }
  }
}
export {
  h as Game
};
