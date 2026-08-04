import Image from "next/image";

export function Brand() {
  return (
    <div className="brand">
      <Image src="/logo.png" alt="" width={22} height={22} style={{ objectFit: "contain", display: "block" }} />
      <span>Movi Body</span>
    </div>
  );
}
