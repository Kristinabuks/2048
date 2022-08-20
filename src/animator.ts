interface IAnimator {
  next(dt: number): boolean;
  finalize(): void;
  currentState(): AnimationSpec;
}

interface AnimationSpec {
  x: number;
  y: number;
  scale: number;
  value: number;
}

class LinearAnimator implements IAnimator {
  start: AnimationSpec;
  end: AnimationSpec;
  duration: number;
  t: number;
  value: number;

  constructor(start: AnimationSpec, end: AnimationSpec, duration: number) {
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.t = 0;
  }

  currentState(): AnimationSpec {
    const normT = this.t / this.duration;

    const spec = {
      x: (this.end.x - this.start.x) * normT + this.start.x,
      y: (this.end.y - this.start.y) * normT + this.start.y,
      scale: (this.end.scale - this.start.scale) * normT + this.start.scale,
      value: this.start.value,
    };

    return spec;
  }

  next(dt: number): boolean {
    if (this.t == this.duration) {
      return false;
    }

    this.t = Math.min(this.t + dt, this.duration);

    return true;
  }

  finalize() {
    this.t = this.duration;
  }
}

interface KeyFrames {
  [Key: string]: AnimationSpec;
}

class CombinedAnimator implements IAnimator {
  segments: Array<IAnimator>;
  idx: number;

  constructor(keyFrames: KeyFrames, duration: number) {
    this.idx = 0;
    this.segments = [];
    const points = Object.keys(keyFrames).sort();
    for (let i = 0; i < points.length - 1; i++) {
      let start = points[i];
      let end = points[i + 1];
      let segmentDuration = (parseFloat(end) - parseFloat(start)) * duration;
      this.segments.push(
        new LinearAnimator(keyFrames[start], keyFrames[end], segmentDuration)
      );
    }
  }

  next(dt: number): boolean {
    if (this.idx === this.segments.length) {
      return false;
    }
    if (!this.segments[this.idx].next(dt)) {
      this.idx++;

      return this.next(dt);
    }

    return true;
  }

  currentState(): AnimationSpec {
    const idx = Math.min(this.segments.length - 1, this.idx);

    return this.segments[idx].currentState();
  }

  finalize() {
    if (this.idx !== this.segments.length) {
        this.segments[this.idx].finalize();
    }
    this.idx = this.segments.length;
  }
}

export { CombinedAnimator };
