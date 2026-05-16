"use client";

import { Bucket } from "@/types";
import { BucketCard } from "./BucketCard";

interface BucketGridProps {
  buckets: Bucket[];
}

export function BucketGrid({ buckets }: BucketGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {buckets.map((bucket) => (
        <BucketCard key={bucket.bucket_id} bucket={bucket} />
      ))}
    </div>
  );
}
