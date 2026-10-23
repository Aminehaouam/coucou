/** Small, rare speech bubble. `tipX`/`tipY` is where the tail points (scene units). */
export default function SpeechBubble({ x, y, lines, tipX, tipY, width = 128 }) {
  const height = 14 + lines.length * 14;
  const tailX = Math.min(Math.max(tipX, x + 16), x + width - 16);
  return (
    <g aria-hidden="true">
      <rect x={x} y={y} width={width} height={height} rx="10" fill="#FAF9F6" />
      <path d={`M${tailX - 7} ${y + height - 1}L${tipX} ${tipY}L${tailX + 7} ${y + height - 1}Z`} fill="#FAF9F6" />
      <text x={x + width / 2} y={y + 17} textAnchor="middle" fontSize="10.5" fontWeight="500" fill="#202D40"
        fontFamily="Inter, system-ui, sans-serif">
        {lines.map((line, i) => (
          <tspan key={line} x={x + width / 2} dy={i === 0 ? 0 : 14}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}
