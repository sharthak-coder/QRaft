import '@testing-library/jest-dom';

// Standard 2D Context mock for jsdom test runner
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (this: any, type: string) {
    if (type === '2d') {
      return {
        canvas: this,
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (_x: number, _y: number, w: number, h: number) => ({
          data: new Uint8ClampedArray(w * h * 4),
          width: w,
          height: h,
        }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        strokeRect: () => {},
        fill: () => {},
        arc: () => {},
        arcTo: () => {},
        roundRect: () => {},
        createLinearGradient: () => ({
          addColorStop: () => {},
        }),
        createRadialGradient: () => ({
          addColorStop: () => {},
        }),
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  } as any;
}
