import { lighten } from '@mui/system';
import { FC, useEffect, useRef } from 'react';

type SmartSearchSankeyDiagramProps = {
  filterStats: {
    matched: number;
    op: 'add' | 'sub';
    output: number;
  }[];
};

const SmartSearchSankeyDiagram: FC<SmartSearchSankeyDiagramProps> = ({
  filterStats,
}) => {
  const mouseState = useRef({
    hoveredSegment: -1,
  });
  const animFrameRef = useRef(0);
  const startTimeRef = useRef(new Date());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const margin = 30;
  const diagWidth = 200;
  const diagCenter = diagWidth / 2;

  const maxStreamWidth = diagWidth - margin * 2;
  const maxSegOutput = Math.max(...filterStats.map((stats) => stats.output));
  const segHeight = 100;

  const arrowDepth = 10;
  const arrowWidth = 20;

  const color = '#cccccc';

  const diagHeight = filterStats.length * segHeight;
  const animDuration = 1000;

  const render = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const now = new Date();
    const time =
      (now.getTime() - startTimeRef.current.getTime()) % animDuration;
    const gradOffset = (time / animDuration) * 0.96;
    const baseGradient = context.createLinearGradient(0, 0, 0, 4 * diagHeight);
    baseGradient.addColorStop(0 + gradOffset, color);
    baseGradient.addColorStop(0.02 + gradOffset, lighten(color, 0.2));
    baseGradient.addColorStop(0.04 + gradOffset, color);

    const hoverColor = '#f00';
    const hoverGradient = context.createLinearGradient(0, 0, 0, 4 * diagHeight);
    hoverGradient.addColorStop(0 + gradOffset, hoverColor);
    hoverGradient.addColorStop(0.02 + gradOffset, lighten(hoverColor, 0.2));
    hoverGradient.addColorStop(0.04 + gradOffset, hoverColor);

    filterStats.forEach((stats, index) => {
      const inputCount = index > 0 ? filterStats[index - 1].output : 0;
      const inputWidth = (inputCount / maxSegOutput) * maxStreamWidth;
      const outputWidth = (stats.output / maxSegOutput) * maxStreamWidth;

      const change = stats.output - inputCount;
      const changeWidth = (Math.abs(change) / maxSegOutput) * maxStreamWidth;

      const gradient =
        index == mouseState.current.hoveredSegment
          ? hoverGradient
          : baseGradient;
      context.fillStyle = gradient;
      context.beginPath();

      if (inputCount > 0 && change >= 0) {
        // Main stream when adding
        drawPath(
          context,
          [
            ['M', diagCenter - inputWidth / 2, 0],
            ['L', diagCenter + inputWidth / 2, 0],
            [
              'C',
              [diagCenter + inputWidth / 2, 0.4 * segHeight],
              [diagCenter + outputWidth / 2, 0.6 * segHeight],
              [diagCenter + outputWidth / 2, segHeight],
            ],
            ['L', diagCenter - outputWidth / 2 + changeWidth, segHeight],
            [
              'C',
              [diagCenter - outputWidth / 2 + changeWidth, 0.6 * segHeight],
              [diagCenter - inputWidth / 2, 0.4 * segHeight],
              [diagCenter - inputWidth / 2, 0],
            ],
          ],
          index * segHeight
        );
      } else if (inputCount > 0 && change < 0) {
        // Main stream when removing
        drawPath(
          context,
          [
            ['M', diagCenter - inputWidth / 2, 0],
            ['L', diagCenter + inputWidth / 2 - changeWidth, 0],
            [
              'C',
              [diagCenter + inputWidth / 2 - changeWidth, 0.4 * segHeight],
              [diagCenter + outputWidth / 2, 0.6 * segHeight],
              [diagCenter + outputWidth / 2, segHeight],
            ],
            ['L', diagCenter - outputWidth / 2, segHeight],
            [
              'C',
              [diagCenter - outputWidth / 2, 0.6 * segHeight],
              [diagCenter - inputWidth / 2, 0.4 * segHeight],
              [diagCenter - inputWidth / 2, 0],
            ],
          ],
          index * segHeight
        );
      }

      if (change > 0) {
        // Input when adding
        drawPath(
          context,
          [
            ['M', 0, segHeight / 2 + arrowWidth / 2],
            ['L', arrowDepth, segHeight / 2],
            ['L', 0, segHeight / 2 - arrowWidth / 2],
            [
              'C',
              [
                diagCenter - outputWidth / 2 + changeWidth / 2,
                segHeight / 2 - arrowWidth / 2,
              ],
              [diagCenter - outputWidth / 2 + changeWidth, segHeight / 1.5],
              [diagCenter - outputWidth / 2 + changeWidth, segHeight],
            ],
            ['L', diagCenter - outputWidth / 2, segHeight],
            [
              'C',
              [diagCenter - outputWidth / 2, segHeight / 1.5],
              [diagCenter - outputWidth / 2, segHeight / 2 + arrowWidth / 2],
              [0, segHeight / 2 + arrowWidth / 2],
            ],
          ],
          index * segHeight
        );
      } else if (change < 0) {
        // Output when removing
        drawPath(
          context,
          [
            ['M', diagCenter + inputWidth / 2 - changeWidth, 0],
            ['L', diagCenter + inputWidth / 2, 0],
            [
              'C',
              [diagCenter + inputWidth / 2, segHeight / 3],
              [diagWidth - margin, segHeight / 2 - arrowWidth / 2],
              [diagWidth - arrowDepth, segHeight / 2 - arrowWidth / 2],
            ],
            ['L', diagWidth, segHeight / 2],
            ['L', diagWidth - arrowDepth, segHeight / 2 + arrowWidth / 2],
            [
              'C',
              [diagWidth - margin, segHeight / 2 + arrowWidth / 2],
              [diagCenter + inputWidth / 2 - changeWidth, segHeight / 2],
              [diagCenter + inputWidth / 2 - changeWidth, 0],
            ],
          ],
          index * segHeight
        );
      }
      context.fill();

      if (change == 0) {
        const lineWidth = 2;
        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = lineWidth;
        context.setLineDash([3, 3]);

        // Change is zero, so we should render a placeholder
        if (stats.op == 'add') {
          drawPath(
            context,
            [
              ['M', 0, segHeight / 2 + arrowWidth / 2],
              ['L', arrowDepth, segHeight / 2],
              ['L', 0, segHeight / 2 - arrowWidth / 2],
              [
                'C',
                [
                  diagCenter - outputWidth / 2 + arrowWidth / 2,
                  segHeight / 2 - arrowWidth / 2,
                ],
                [diagCenter - outputWidth / 2 + arrowWidth, segHeight / 1.5],
                [
                  diagCenter - outputWidth / 2 + arrowWidth,
                  segHeight - lineWidth / 2,
                ],
              ],
              [
                'L',
                diagCenter - outputWidth / 2 + lineWidth / 2,
                segHeight - lineWidth / 2,
              ],
              [
                'C',
                [diagCenter - outputWidth / 2, segHeight / 1.5],
                [diagCenter - outputWidth / 2, segHeight / 2 + arrowWidth / 2],
                [0, segHeight / 2 + arrowWidth / 2],
              ],
            ],
            index * segHeight
          );
        } else if (stats.op == 'sub') {
          drawPath(
            context,
            [
              ['M', diagCenter + inputWidth / 2 - arrowWidth, lineWidth / 2],
              ['L', diagCenter + inputWidth / 2 - lineWidth / 2, lineWidth / 2],
              [
                'C',
                [diagCenter + inputWidth / 2, segHeight / 3],
                [diagWidth - margin, segHeight / 2 - arrowWidth / 2],
                [diagWidth - arrowDepth, segHeight / 2 - arrowWidth / 2],
              ],
              ['L', diagWidth, segHeight / 2],
              ['L', diagWidth - arrowDepth, segHeight / 2 + arrowWidth / 2],
              [
                'C',
                [diagWidth - margin, segHeight / 2 + arrowWidth / 2],
                [diagCenter + inputWidth / 2 - arrowWidth, segHeight / 2],
                [diagCenter + inputWidth / 2 - arrowWidth, 0],
              ],
            ],
            index * segHeight
          );
        }

        context.stroke();
      }
    });

    const lastStats = filterStats[filterStats.length - 1];
    const outputWidth = (lastStats.output / maxSegOutput) * maxStreamWidth;
    context.fillStyle = baseGradient;
    context.beginPath();
    context.moveTo(diagCenter - outputWidth / 2, diagHeight);
    context.lineTo(diagCenter + outputWidth / 2, diagHeight);
    context.lineTo(diagCenter, diagHeight + arrowDepth * 2);
    context.lineTo(diagCenter - outputWidth / 2, diagHeight);
    context.fill();
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      render(context);
    }

    function nextFrame() {
      if (context) {
        render(context);
        animFrameRef.current = requestAnimationFrame(nextFrame);
      }
    }

    function handleMouseOut() {
      mouseState.current.hoveredSegment = -1;
    }

    function handleMouseMove(ev: MouseEvent) {
      const count = filterStats.length;
      const index = Math.floor((ev.offsetY / diagHeight) * count);
      mouseState.current.hoveredSegment = Math.max(
        0,
        Math.min(index, count - 1)
      );
    }

    animFrameRef.current = requestAnimationFrame(nextFrame);
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mouseout', handleMouseOut);
    };
  }, [canvasRef.current, filterStats]);

  return (
    <canvas
      ref={canvasRef}
      height={diagHeight + arrowDepth * 2}
      width={diagWidth}
    />
  );
};

type PathElem =
  | ['C', [number, number], [number, number], [number, number]]
  | ['M', number, number]
  | ['L', number, number];

function drawPath(
  context: CanvasRenderingContext2D,
  path: PathElem[],
  offsetY = 0
): void {
  for (const elem of path) {
    if (elem[0] == 'M') {
      context.moveTo(elem[1], elem[2] + offsetY);
    } else if (elem[0] == 'C') {
      const [, c1, c2, p] = elem;
      context.bezierCurveTo(
        c1[0],
        c1[1] + offsetY,
        c2[0],
        c2[1] + offsetY,
        p[0],
        p[1] + offsetY
      );
    } else if (elem[0] == 'L') {
      context.lineTo(elem[1], elem[2] + offsetY);
    }
  }
}

export default SmartSearchSankeyDiagram;
