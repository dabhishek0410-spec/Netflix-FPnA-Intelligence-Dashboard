import { redirect } from "next/navigation";

export default function Home() {
  // Seamlessly route standard landing visits to the core Executive Summary cockpit.
  redirect("/executive");
}
