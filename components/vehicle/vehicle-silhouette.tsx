import type { BodyStyle } from "@/lib/vehicle-silhouette";

const WHEEL_R = 15;

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={WHEEL_R} fill="black" fillOpacity={0.4} />
      <circle cx={cx} cy={cy} r={WHEEL_R - 3} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={WHEEL_R - 8} fill="black" fillOpacity={0.3} />
      <circle cx={cx} cy={cy} r={2} fill="currentColor" fillOpacity={0.6} />
      {/* wheel arch shadow */}
      <path
        d={`M${cx - WHEEL_R - 3},${cy - 2} A${WHEEL_R + 3},${WHEEL_R + 3} 0 0 1 ${cx + WHEEL_R + 3},${cy - 2}`}
        fill="none"
        stroke="black"
        strokeOpacity={0.25}
        strokeWidth={4}
      />
    </g>
  );
}

function Mirror({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <path
      d={flip ? `M${x},${y} C${x - 6},${y - 1} ${x - 8},${y + 3} ${x - 5},${y + 5} C${x - 2},${y + 4} ${x},${y + 1} ${x},${y} Z`
        : `M${x},${y} C${x + 6},${y - 1} ${x + 8},${y + 3} ${x + 5},${y + 5} C${x + 2},${y + 4} ${x},${y + 1} ${x},${y} Z`}
      fillOpacity={0.85}
    />
  );
}

function CoupeSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 100" className={className} fill="currentColor">
      {/* body */}
      <path d="M9,76 C9,64 18,58 28,55 C33,45 40,34 52,27 C68,17 88,12 108,11 C126,10 143,12 156,17 C170,22 180,32 187,44 C199,46 214,50 227,58 C233,61 234,66 234,72 L234,75 C234,79 231,80.5 225,80.5 L204,80.5 C202,71 194,65 183,65 C172,65 164,71 162,80.5 L84,80.5 C82,71 74,65 63,65 C52,65 44,71 42,80.5 L18,80.5 C12,80.5 9,79 9,76 Z" />
      {/* glass greenhouse */}
      <path d="M56,53 C63,38 73,28 88,22 C100,17 114,15 127,16 C122,20 116,25 111,32 C104,30 96,30 89,33 C79,37 71,44 65,53 Z" fillOpacity={0.32} />
      <path d="M130,17 C144,17 158,21 168,29 C174,35 178,41 181,47 C171,42 159,38 147,37 C142,32 137,25 130,17 Z" fillOpacity={0.32} />
      {/* character line */}
      <path d="M30,56 C70,50 150,50 224,60" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      {/* rear spoiler */}
      <path d="M196,42 L226,46 L226,49 L198,46 Z" fillOpacity={0.7} />
      <path d="M223,46 L228,58 L225,58 L221,46.5 Z" fillOpacity={0.7} />
      <Mirror x={62} y={49} />
      <Wheel cx={63} cy={80.5} />
      <Wheel cx={183} cy={80.5} />
    </svg>
  );
}

function SuvSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 100" className={className} fill="currentColor">
      <path d="M8,80 C8,66 18,60 28,57 C34,44 48,29 66,24 C74,21.5 82,20.5 90,20 L172,20 C186,22 198,30 206,42 C216,45 228,49 234,58 C237,62 237,68 237,74 L237,78 C237,82 234,83.5 228,83.5 L204,83.5 C202,74 194,68 183,68 C172,68 164,74 162,83.5 L80,83.5 C78,74 70,68 59,68 C48,68 40,74 38,83.5 L16,83.5 C11,83.5 8,82 8,80 Z" />
      <path d="M78,55 C82,40 92,29 106,24 C110,29 112,36 112,44 L110,55 Z" fillOpacity={0.32} />
      <path d="M116,44 L118,24 L165,23 C176,26 186,33 192,44 Z" fillOpacity={0.32} />
      {/* roof rail */}
      <path d="M92,21 L166,20.5" fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
      <path d="M30,58 C80,52 170,52 232,60" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <Mirror x={80} y={46} />
      <Wheel cx={59} cy={83.5} />
      <Wheel cx={183} cy={83.5} />
    </svg>
  );
}

function SedanSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 95" className={className} fill="currentColor">
      <path d="M10,74 C10,62 20,56 30,53 C38,40 50,28 66,22 C76,18.5 87,17.5 97,18 C104,15 114,14.5 123,16 C138,13.5 156,14.5 171,19 C186,23.5 197,31 205,42 C218,44 233,49 242,58 C248,61 249,66 249,72 L249,75 C249,79 246,80.5 240,80.5 L216,80.5 C214,71 206,65 195,65 C184,65 176,71 174,80.5 L86,80.5 C84,71 76,65 65,65 C54,65 46,71 44,80.5 L18,80.5 C13,80.5 10,78.5 10,74 Z" />
      <path d="M62,51 C71,37 82,27 96,22 C92,29 89,37 88,45 L84,51 Z" fillOpacity={0.32} />
      <path d="M100,19 C102,26 100,34 96,42 L100,42 C108,32 118,25 129,21 C120,19 110,18 100,19 Z" fillOpacity={0.32} />
      <path d="M133,17 C149,15 165,17 178,22 C188,27 195,34 200,42 C189,38 177,35 165,34 C158,27 146,20 133,17 Z" fillOpacity={0.32} />
      <path d="M30,56 C80,49 180,49 240,60" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <Mirror x={68} y={47} />
      <Wheel cx={65} cy={80.5} />
      <Wheel cx={195} cy={80.5} />
    </svg>
  );
}

function ConvertibleSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 100" className={className} fill="currentColor">
      <path d="M9,76 C9,64 18,58 28,55 C33,46 39,38 47,32 C50,40 52,46 56,50 L74,50 C78,42 84,36 92,32 C90,38 89,44 89,50 L170,50 C176,39 184,31 194,27 C199,32 202,38 200,44 C193,42 186,42 180,44 C182,46 184,48 187,50 C199,52 214,54 227,60 C233,63 234,68 234,72 L234,75 C234,79 231,80.5 225,80.5 L204,80.5 C202,71 194,65 183,65 C172,65 164,71 162,80.5 L84,80.5 C82,71 74,65 63,65 C52,65 44,71 42,80.5 L18,80.5 C12,80.5 9,79 9,76 Z" />
      <path d="M58,48 C64,38 70,32 78,28 C75,35 74,42 75,48 Z" fillOpacity={0.32} />
      <path d="M92,48 C97,40 104,34 112,30 C126,28 141,29 154,33 C160,36 165,40 168,45 L168,48 Z" fillOpacity={0.32} />
      <path d="M30,56 C70,50 150,50 224,60" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <Mirror x={62} y={45} />
      <Wheel cx={63} cy={80.5} />
      <Wheel cx={183} cy={80.5} />
    </svg>
  );
}

function JetSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 80" className={className} fill="currentColor">
      {/* fuselage */}
      <path d="M4,42 C4,31 18,25 36,23 L60,22 C64,16 72,12 82,11 L192,10 C210,10 225,15 237,23 C247,29 253,34 256,39 C253,42 247,45 238,48 C224,54 208,57 190,57 L84,57 C74,56 65,53 60,48 L36,47 C18,45 4,40 4,42 Z" />
      {/* cockpit glass */}
      <path d="M62,25 C70,18 80,14 90,12.5 L100,12 L98,24 L64,25 Z" fillOpacity={0.35} />
      {/* cabin windows row */}
      <g fillOpacity={0.5}>
        <circle cx="110" cy="24" r="2.4" />
        <circle cx="122" cy="23.5" r="2.4" />
        <circle cx="134" cy="23" r="2.4" />
        <circle cx="146" cy="22.5" r="2.4" />
        <circle cx="158" cy="22" r="2.4" />
        <circle cx="170" cy="21.7" r="2.4" />
        <circle cx="182" cy="21.5" r="2.4" />
      </g>
      {/* wing */}
      <path d="M112,50 L62,74 C60,75.5 61,77 63,76.5 L124,54 Z" />
      <path d="M148,50 L196,73 C198,74.5 197,76.5 195,76 L136,54 Z" />
      {/* engine nacelle under wing */}
      <ellipse cx="92" cy="63" rx="10" ry="4.5" transform="rotate(18 92 63)" fillOpacity={0.85} />
      <ellipse cx="168" cy="63" rx="10" ry="4.5" transform="rotate(-18 168 63)" fillOpacity={0.85} />
      {/* T-tail */}
      <path d="M214,25 C220,15 228,6 236,2 C239,1 241,2.5 240,6 C237,16 231,26 224,32 Z" />
      <path d="M212,26 L246,20 C249,19.5 250,21.5 248,23 L216,32 Z" fillOpacity={0.8} />
      {/* nose stripe */}
      <path d="M6,40 C6,37 12,35 20,34 L20,46 C12,45 6,43 6,40 Z" fillOpacity={0.5} />
    </svg>
  );
}

export function VehicleSilhouette({
  bodyStyle,
  className,
}: {
  bodyStyle: BodyStyle;
  className?: string;
}) {
  switch (bodyStyle) {
    case "suv":
      return <SuvSilhouette className={className} />;
    case "sedan":
      return <SedanSilhouette className={className} />;
    case "convertible":
      return <ConvertibleSilhouette className={className} />;
    case "jet":
      return <JetSilhouette className={className} />;
    case "coupe":
    default:
      return <CoupeSilhouette className={className} />;
  }
}
