import Image from "next/image";

export function Brand() {
  return (
    <div className="brand">
      <Image src="/logo.png" alt="Movi Body" width={36} height={36} style={{ objectFit: "contain", display: "block" }} />
    </div>
  );
}
