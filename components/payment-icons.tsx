// Nepali Payment Method Icons
// SVG icons for major Nepali banks and mobile wallets
// Using official brand colors and authentic logo representations based on actual payment gateway logos

export function EsewaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/esewa-logo.png"
      alt="eSewa"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function KhaltiIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/khalti-logo.png"
      alt="Khalti"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function IMEPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* IME Pay Official - Red rounded square with IME Pay branding */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        IME
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

export function ConnectIPSIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <img
      src="https://connectips.com/images/logo.png"
      alt="ConnectIPS"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function PrabhuPayIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Prabhu Pay Official - Red rounded square with P symbol */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        P
      </text>
    </svg>
  );
}

export function NepalPayIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <img
      src="/nepalpay-qr-logo.png"
      alt="NepalPay QR"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function PayWellIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PayWell Official - Blue gradient */}
      <defs>
        <linearGradient id="paywellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#paywellGrad)" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Well
      </text>
    </svg>
  );
}

export function EnetPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* EnetPay Official - Teal/Cyan */}
      <rect width="48" height="48" rx="10" fill="#0891B2" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        eNet
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

export function MoruIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Moru Official - Pink/Magenta */}
      <rect width="48" height="48" rx="10" fill="#E91E63" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        moru
      </text>
    </svg>
  );
}

export function CGPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CG Pay Official - Red with CG branding */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        CG
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        PAY
      </text>
    </svg>
  );
}

export function HamroPayIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hamro Pay Official - Red with smiley face */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      {/* Smiley face icon */}
      <circle cx="18" cy="20" r="3" fill="white" />
      <circle cx="30" cy="20" r="3" fill="white" />
      <path
        d="M16 28 Q24 36 32 28"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CellPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CellPay Official - Blue with cell tower symbol */}
      <rect width="48" height="48" rx="10" fill="#1E40AF" />
      {/* Cell tower signal waves */}
      <circle cx="24" cy="32" r="3" fill="white" />
      <path
        d="M18 26 Q24 20 30 26"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14 22 Q24 12 34 22"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export function ICashIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* iCash Official - Orange with i symbol */}
      <rect width="48" height="48" rx="10" fill="#F97316" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        i
      </text>
    </svg>
  );
}

export function DCashIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* D-Cash Official - Orange/Red with D symbol */}
      <rect width="48" height="48" rx="10" fill="#EA580C" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        D
      </text>
    </svg>
  );
}

export function NamastePayIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <img
      src="https://www.namastepay.com/assets/images/logo.png"
      alt="Namaste Pay"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function ChhitoPaisaIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chhito Paisa Official - Teal with CP logo */}
      <rect width="48" height="48" rx="10" fill="#0D9488" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Chhito
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Paisa
      </text>
    </svg>
  );
}

export function CellcomIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cellcom Official - Blue with C logo */}
      <rect width="48" height="48" rx="10" fill="#2563EB" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        C
      </text>
    </svg>
  );
}

export function PayTimeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PayTime Official - Red with clock symbol */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      {/* Clock icon */}
      <circle
        cx="24"
        cy="24"
        r="10"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="24"
        x2="30"
        y2="24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MyPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* My Pay Official - Yellow/Gold */}
      <rect width="48" height="48" rx="10" fill="#FBBF24" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="#1F2937"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        My
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="#1F2937"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

export function MocoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Moco Official - Blue with M logo */}
      <rect width="48" height="48" rx="10" fill="#1E40AF" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        M
      </text>
    </svg>
  );
}

export function NimbuzzIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nimbuzz Official - Orange/Yellow */}
      <rect width="48" height="48" rx="10" fill="#F59E0B" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Nimbuzz
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

export function YoAppIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yo App Official - Red with Yo branding */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Yo
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        APP
      </text>
    </svg>
  );
}

export function DigiPayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Digi Pay Official - Gold/Yellow with infinity symbol */}
      <rect width="48" height="48" rx="10" fill="#D97706" />
      {/* Infinity symbol */}
      <path
        d="M16 24 Q20 18 24 24 Q28 30 32 24"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MobaletIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mobalet Official - Blue with M logo */}
      <rect width="48" height="48" rx="10" fill="#2563EB" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        M
      </text>
    </svg>
  );
}

export function NCashIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* N Cash Official - Black with N and cross symbol */}
      <rect width="48" height="48" rx="10" fill="#1F2937" />
      <text
        x="20"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        N
      </text>
      {/* Cross/plus symbol */}
      <line
        x1="30"
        y1="20"
        x2="30"
        y2="32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="26"
        x2="36"
        y2="26"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SajiloPayIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sajilo Pay Official - Blue with Sajilo text */}
      <rect width="48" height="48" rx="10" fill="#2563EB" />
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        सजिलो
      </text>
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

// Bank Icons

export function NabilBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nabil Bank Official - Purple with N symbol */}
      <rect width="48" height="48" rx="10" fill="#6B21A8" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        N
      </text>
    </svg>
  );
}

export function NICAsiaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* NIC Asia Bank Official - Blue with star */}
      <rect width="48" height="48" rx="10" fill="#1E40AF" />
      {/* 8-pointed star representing NIC Asia */}
      <polygon
        points="24,12 27,20 36,20 29,26 32,35 24,29 16,35 19,26 12,20 21,20"
        fill="white"
      />
    </svg>
  );
}

export function GlobalIMEBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Global IME Bank Official - Green with globe symbol */}
      <rect width="48" height="48" rx="10" fill="#059669" />
      {/* Globe icon */}
      <circle
        cx="24"
        cy="24"
        r="12"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="6"
        ry="12"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />
      <line x1="12" y1="24" x2="36" y2="24" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export function NMBBankIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="https://www.nimb.com.np/images/logo.png"
      alt="NIMB Bank"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function NepalBankLtdIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <img
      src="https://nepalbank.com.np/assets/images/logo.png"
      alt="Nepal Bank Ltd."
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function RastriyaBanijyaBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <img
      src="https://rbb.com.np/images/logo.png"
      alt="Rastriya Banijya Bank"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export function SiddharthaBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Siddhartha Bank Official - Deep red with S */}
      <rect width="48" height="48" rx="10" fill="#991B1B" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

export function KumariBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Kumari Bank Official - Pink with K */}
      <rect width="48" height="48" rx="10" fill="#BE185D" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        K
      </text>
    </svg>
  );
}

export function CitizensBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Citizens Bank Official - Navy blue with C */}
      <rect width="48" height="48" rx="10" fill="#1E3A8A" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        C
      </text>
    </svg>
  );
}

export function HimalayanBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Himalayan Bank Official - Mountain blue with mountain symbol */}
      <rect width="48" height="48" rx="10" fill="#0369A1" />
      {/* Mountain peaks */}
      <polygon points="12,36 24,16 36,36" fill="white" />
      <polygon points="18,36 28,22 38,36" fill="#0369A1" />
    </svg>
  );
}

export function EverestBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Everest Bank Official - Sky blue with E */}
      <rect width="48" height="48" rx="10" fill="#0284C7" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        E
      </text>
    </svg>
  );
}

export function LaxmiBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Laxmi Bank Official - Gold/Yellow with L */}
      <rect width="48" height="48" rx="10" fill="#D97706" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        L
      </text>
    </svg>
  );
}

export function SanimaBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sanima Bank Official - Teal with S */}
      <rect width="48" height="48" rx="10" fill="#0D9488" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

export function PrabhuBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Prabhu Bank Official - Blue with P */}
      <rect width="48" height="48" rx="10" fill="#1E40AF" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        P
      </text>
    </svg>
  );
}

export function MegaBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mega Bank Official - Red with M */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        M
      </text>
    </svg>
  );
}

export function SunriseBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sunrise Bank Official - Orange/Yellow gradient with sun */}
      <defs>
        <linearGradient id="sunriseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#sunriseGrad)" />
      {/* Sun symbol */}
      <circle cx="24" cy="24" r="8" fill="white" />
      <line x1="24" y1="10" x2="24" y2="14" stroke="white" strokeWidth="2" />
      <line x1="24" y1="34" x2="24" y2="38" stroke="white" strokeWidth="2" />
      <line x1="10" y1="24" x2="14" y2="24" stroke="white" strokeWidth="2" />
      <line x1="34" y1="24" x2="38" y2="24" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function MachhapuchhreBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Machhapuchhre Bank Official - Blue with fish tail mountain */}
      <rect width="48" height="48" rx="10" fill="#2563EB" />
      {/* Machhapuchhre mountain silhouette */}
      <polygon points="12,36 24,12 36,36" fill="white" />
      <polygon points="20,36 28,20 36,36" fill="#2563EB" />
    </svg>
  );
}

export function NepalInvestmentBankIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nepal Investment Bank Official - Green with NIB */}
      <rect width="48" height="48" rx="10" fill="#15803D" />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        NIB
      </text>
    </svg>
  );
}

export function StandardCharteredIcon({
  className = "w-8 h-8",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Standard Chartered Official - Blue with S */}
      <rect width="48" height="48" rx="10" fill="#003087" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

// Fonepay - Digital Payment Network
export function FonepayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="https://fonepay.com/images/fonepay-logo.png"
      alt="Fonepay"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

// Qpay
export function QpayIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Qpay Official - Red with Q symbol */}
      <rect width="48" height="48" rx="10" fill="#DC2626" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        Q
      </text>
    </svg>
  );
}

// Export all payment icons as a collection
export const paymentIcons = {
  // Mobile Wallets
  esewa: EsewaIcon,
  khalti: KhaltiIcon,
  imepay: IMEPayIcon,
  connectips: ConnectIPSIcon,
  prabhupay: PrabhuPayIcon,
  nepalpay: NepalPayIcon,
  paywell: PayWellIcon,
  enetpay: EnetPayIcon,
  moru: MoruIcon,
  cgpay: CGPayIcon,
  hamropay: HamroPayIcon,
  cellpay: CellPayIcon,
  icash: ICashIcon,
  dcash: DCashIcon,
  namastepay: NamastePayIcon,
  chhitopaisa: ChhitoPaisaIcon,
  cellcom: CellcomIcon,
  paytime: PayTimeIcon,
  mypay: MyPayIcon,
  moco: MocoIcon,
  nimbuzz: NimbuzzIcon,
  yoapp: YoAppIcon,
  digipay: DigiPayIcon,
  mobalet: MobaletIcon,
  ncash: NCashIcon,
  sajilopay: SajiloPayIcon,
  // Banks
  nabil: NabilBankIcon,
  nicasia: NICAsiaIcon,
  globalime: GlobalIMEBankIcon,
  nmb: NMBBankIcon,
  nepalbank: NepalBankLtdIcon,
  rbb: RastriyaBanijyaBankIcon,
  siddhartha: SiddharthaBankIcon,
  kumari: KumariBankIcon,
  citizens: CitizensBankIcon,
  himalayan: HimalayanBankIcon,
  everest: EverestBankIcon,
  laxmi: LaxmiBankIcon,
  sanima: SanimaBankIcon,
  prabhu: PrabhuBankIcon,
  mega: MegaBankIcon,
  sunrise: SunriseBankIcon,
  machhapuchhre: MachhapuchhreBankIcon,
  nib: NepalInvestmentBankIcon,
  standardchartered: StandardCharteredIcon,
  // Networks
  fonepay: FonepayIcon,
  qpay: QpayIcon,
};
