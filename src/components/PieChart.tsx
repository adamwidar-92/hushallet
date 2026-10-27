import Svg, { Circle, G, Path, Text } from "react-native-svg";

export type Slice = {
  key: string;
  value: number;
  color: string;
  emoji: string;
};

type Props = { slices: Slice[]; size: number };

/** Punkt på cirkeln. Vinkel 0 = klockan 12, medurs. */
function point(r: number, radius: number, angle: number) {
  return { x: r + radius * Math.sin(angle), y: r - radius * Math.cos(angle) };
}

/** Räknar ut start- och slutvinkel för varje tårtbit. */
function toArcs(slices: Slice[]) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let start = 0;
  return slices.map((slice) => {
    const end = start + (slice.value / total) * 2 * Math.PI;
    const arc = { slice, start, end, full: slice.value === total };
    start = end;
    return arc;
  });
}

export function PieChart({ slices, size }: Props) {
  const r = size / 2;

  return (
    <Svg width={size} height={size}>
      {toArcs(slices).map(({ slice, start, end, full }) => {
        const from = point(r, r, start);
        const to = point(r, r, end);
        const largeArc = end - start > Math.PI ? 1 : 0;
        const label = point(r, full ? 0 : r * 0.6, (start + end) / 2);

        return (
          <G key={slice.key}>
            {full ? (
              <Circle cx={r} cy={r} r={r} fill={slice.color} />
            ) : (
              <Path
                d={`M ${r} ${r} L ${from.x} ${from.y} A ${r} ${r} 0 ${largeArc} 1 ${to.x} ${to.y} Z`}
                fill={slice.color}
              />
            )}
            <Text
              x={label.x}
              y={label.y}
              fontSize={size / 6}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {slice.emoji}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}
