export interface SleepSample {
  id: string;
  startDate: string;
  endDate: string;
  value: string;
  sourceName?: string;
  sourceBundleId?: string;
  sourceId?: string;
}

export interface SleepSummary {
  date: string;
  totalHours: number;
}
