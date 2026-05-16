"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleEntry } from "@/types";
import { formatLKR } from "@/lib/utils";

interface RepaymentTimelineProps {
  schedule: ScheduleEntry[];
}

const STATUS_PILL = {
  PAID: "bg-green-100 text-green-700",
  UPCOMING: "bg-blue-100 text-blue-700",
  MISSED: "bg-red-100 text-red-700",
};

export function RepaymentTimeline({ schedule }: RepaymentTimelineProps) {
  const [tab, setTab] = useState("all");

  const filtered =
    tab === "all"
      ? schedule
      : schedule.filter((e) => e.status.toLowerCase() === tab);

  return (
    <Card className="border-seylan-border">
      <CardContent className="p-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <div className="max-h-[320px] overflow-y-auto space-y-2">
              {filtered.map((entry) => (
                <div
                  key={`${entry.month}-${entry.due_date}`}
                  className="flex items-center justify-between py-2 border-b border-seylan-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">
                      #{entry.month}
                    </span>
                    <span className="text-sm text-seylan-charcoal">
                      {new Date(entry.due_date).toLocaleDateString("en-LK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatLKR(entry.amount_lkr)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_PILL[entry.status]}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No entries
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
