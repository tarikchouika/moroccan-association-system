import { LandingPage } from "@/components/site/landing-page";
import { DEMO_DATA } from "@/generated/demo-data";

export default function HomePage() {
  return <LandingPage data={DEMO_DATA} />;
}
