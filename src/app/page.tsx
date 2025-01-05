import { GitHubService } from "@/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Since we're fetching data, we need to make this an async component
export default async function Home() {
  // Fetch workflow runs using GitHubService
  const workflowRuns = (await GitHubService.getUserRepositoriesWorkflows()).filter(item => item.total_count > 0)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="flex w-full justify-between items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Workflow runs
          </h3>
        </div>
        < Table >
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">HTML URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflowRuns.map((item) => (
              item.workflows.map((workflow, index) => 
              <TableRow key={index}>
                <TableCell>{workflow.id}</TableCell>
                <TableCell>{workflow.name}</TableCell>
                <TableCell>{workflow.path}</TableCell>
                <TableCell>{workflow.state}</TableCell>
                <TableCell>{workflow.created_at}</TableCell>
              </TableRow>
              )
            ))}
          </TableBody>
        </Table >
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
