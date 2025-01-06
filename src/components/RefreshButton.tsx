'use client';

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        router.refresh();
      }}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
} 