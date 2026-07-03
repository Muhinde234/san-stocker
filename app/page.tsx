import { HomeNav } from "@/components/home-nav";
import { HomeHero } from "@/components/home-hero";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-linear-to-br from-[#1E2048] via-[#2d3580] to-white">
      <HomeNav />
      <HomeHero />
    </main>
  );
}
