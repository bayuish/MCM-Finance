import React from "react";

interface BarcodeProps {
  value: string;
  height?: number;
  showText?: boolean;
  className?: string;
}

// Simple & crisp SVG Code128 / Barcode Generator Component
export const BarcodeSVG: React.FC<BarcodeProps> = ({
  value,
  height = 42,
  showText = true,
  className = "",
}) => {
  // Deterministic bar widths pattern based on ASCII char codes for realistic barcode look
  const generateBarPattern = (str: string): number[] => {
    const bars: number[] = [2, 1, 2, 2, 1, 1]; // Start pattern
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const w1 = (code % 3) + 1;
      const w2 = ((code * 2) % 3) + 1;
      const w3 = ((code * 3) % 2) + 1;
      const w4 = ((code + 5) % 3) + 1;
      bars.push(w1, w2, w3, w4);
    }
    bars.push(2, 3, 3, 1, 1, 2); // Stop pattern
    return bars;
  };

  const pattern = generateBarPattern(value || "MCM-000");

  // Calculate total SVG width
  const totalWidth = pattern.reduce((acc, curr) => acc + curr, 0) * 2;

  let currentX = 0;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="block fill-current text-slate-950"
      >
        {pattern.map((width, idx) => {
          const isBar = idx % 2 === 0;
          const barWidth = width * 2;
          const rect = isBar ? (
            <rect
              key={idx}
              x={currentX}
              y={0}
              width={barWidth}
              height={height}
              fill="#090d16"
            />
          ) : null;
          currentX += barWidth;
          return rect;
        })}
      </svg>
      {showText && (
        <span className="font-mono font-bold tracking-[0.25em] text-[11px] text-slate-900 mt-1">
          *{value}*
        </span>
      )}
    </div>
  );
};

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// Crisp Vector QR Code Generator (21x21 Matrix Pattern)
export const QRCodeSVG: React.FC<QRCodeProps> = ({
  value,
  size = 76,
  className = "",
}) => {
  // Generate deterministic 21x21 QR Matrix with position detection patterns at 3 corners
  const matrixSize = 21;
  const grid: boolean[][] = Array(matrixSize)
    .fill(false)
    .map(() => Array(matrixSize).fill(false));

  // Helper to add Finder Pattern (7x7 outer, 5x5 inner)
  const addFinderPattern = (startR: number, startC: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[startR + r][startC + c] = true;
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finder patterns
  addFinderPattern(0, 0);
  addFinderPattern(0, 14);
  addFinderPattern(14, 0);

  // Fill pseudo-random data modules derived from string hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder pattern zones
      if (
        (r <= 7 && c <= 7) ||
        (r <= 7 && c >= 13) ||
        (r >= 13 && c <= 7)
      ) {
        continue;
      }
      // Pseudo data bit calculation
      const bit = Math.abs((hash ^ (r * 31 + c * 17)) % 3) === 0;
      grid[r][c] = bit;
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className={`inline-block border-2 border-slate-900 p-1.5 bg-white rounded-lg shadow-sm ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {grid.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
