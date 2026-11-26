import { connection } from "next/server";
import { getSettings } from "@/lib/db";
import MainEventFlow from "@/components/MainEventFlow";

export default async function HomePage() {
  await connection();
  const settings = await getSettings();

  return (
    <MainEventFlow
      settings={{
        companyName: settings.companyName || "GLOBAL SAFE",
        companyLogo: settings.companyLogo || "/assets/logo.png",
        revealDate: settings.revealDate || "2026-11-27T00:00:00",
        eventDate: settings.eventDate || "2026-12-24T18:00:00",
        rules: settings.rules,
      }}
    />
  );
}
