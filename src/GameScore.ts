class GameScore {
  gameScoreView: HTMLElement;
  score: number;

  constructor() {
    this.gameScoreView = document.getElementById("game-score");
    this.score = 0;
  }

  update(value: number) {
    this.score += value;
    this.gameScoreView.innerText = `Score:\xa0${this.score}`;
  }
}

export { GameScore };
