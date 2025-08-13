"use client";
import { motion } from "framer-motion";

type Datum = { label: string; value: number };

export default function BarChartMini({ data }: { data: Datum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2">
      {data.map((d, i) => {
        const h = Math.max(4, Math.round((d.value / max) * 72));
        return (
          <div key={d.label} className="flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="w-6 rounded bg-indigo-500"
              title={`${d.label}: ${d.value}`}
            />
            <div className="text-[10px] text-gray-500">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}


