import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

export default function Loading() {
  return (
    <div className="grid place-items-center h-screen">
      <Ring color="#155dfc" />
    </div>
  );
}
