import { NotebookTabs } from "lucide-react";

export function TopNav() {
  return (
    <div className="flex flex-row items-center justify-between mb-5">
      <div className="flex flex-row gap-2"></div>
      <div className="flex flex-row items-center justify-center gap-2 border-b-4 border-primary">
        <NotebookTabs className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Listly</h1>
      </div>
      <div className="flex flex-row gap-2">Settings</div>
    </div>
  );
}
