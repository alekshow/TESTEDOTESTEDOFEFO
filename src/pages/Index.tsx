import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { DraftAnalysisSection } from "@/components/dashboard/DraftAnalysisSection";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { ImportDataSection } from "@/components/dashboard/ImportDataSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "draft":
        return <DraftAnalysisSection />;
      case "performance":
        return <PerformanceSection />;
      case "teams":
        return <div className="p-8 text-center text-muted-foreground">Teams section coming soon...</div>;
      case "matches":
        return <div className="p-8 text-center text-muted-foreground">Matches section coming soon...</div>;
      case "tournaments":
        return <div className="p-8 text-center text-muted-foreground">Tournaments section coming soon...</div>;
      case "import":
        return <ImportDataSection />;
      case "settings":
        return <div className="p-8 text-center text-muted-foreground">Settings section coming soon...</div>;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;