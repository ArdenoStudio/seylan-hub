"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bucket } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AllocationEditorProps {
  buckets: Bucket[];
  onSave: (allocations: Record<string, number>) => void;
}

export function AllocationEditor({ buckets, onSave }: AllocationEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    Object.fromEntries(buckets.map((b) => [b.bucket_id, b.allocation_pct]))
  );

  const total = Object.values(allocations).reduce((sum, v) => sum + v, 0);

  function handleChange(bucketId: string, newValue: number) {
    const others = Object.entries(allocations).filter(
      ([id]) => id !== bucketId
    );
    const remaining = 100 - newValue;
    const othersTotal = others.reduce((sum, [, v]) => sum + v, 0);

    const updated: Record<string, number> = { [bucketId]: newValue };

    if (othersTotal === 0) {
      const share = Math.round(remaining / others.length);
      others.forEach(([id], i) => {
        updated[id] = i === others.length - 1 ? remaining - share * (others.length - 1) : share;
      });
    } else {
      others.forEach(([id, v]) => {
        updated[id] = Math.round((v / othersTotal) * remaining);
      });
      const newTotal = Object.values(updated).reduce((s, v) => s + v, 0);
      if (newTotal !== 100 && others.length > 0) {
        const firstOther = others[0][0];
        updated[firstOther] += 100 - newTotal;
      }
    }

    setAllocations(updated);
  }

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="w-full flex items-center justify-between text-sm font-medium text-seylan-charcoal"
        >
          <span>Allocation Rules</span>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {buckets.map((bucket) => (
              <div key={bucket.bucket_id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{bucket.label}</span>
                  <span className="font-medium">
                    {allocations[bucket.bucket_id] ?? 0}%
                  </span>
                </div>
                <Slider
                  value={[allocations[bucket.bucket_id] ?? 0]}
                  onValueChange={(val) =>
                    handleChange(bucket.bucket_id, Array.isArray(val) ? val[0] : val)
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 border-t border-seylan-border">
              <span
                className={`text-sm font-medium ${
                  total === 100 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                Total: {total}%
              </span>
              <Button
                size="sm"
                disabled={total !== 100}
                onClick={() => onSave(allocations)}
              >
                Save Rules
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
