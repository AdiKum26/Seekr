import { DashboardCards } from "../components/dashboard/DashboardCards";
import { HeroSection } from "../components/home/HeroSection";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <DashboardCards />
    </div>
  );
}
