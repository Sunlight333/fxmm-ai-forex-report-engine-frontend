"use client";

import { TabGroup, TabList, Tab as HeadlessTab, TabPanels, TabPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
  defaultIndex?: number;
}

export function Tabs({ items, className, defaultIndex = 0 }: TabsProps) {
  return (
    <TabGroup defaultIndex={defaultIndex} className={className}>
      <TabList className="flex gap-1 rounded-lg bg-dark-surface p-1">
        {items.map((item) => (
          <HeadlessTab
            key={item.label}
            className={({ selected }) =>
              cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors outline-none",
                selected
                  ? "bg-dark-card text-white shadow"
                  : "text-gray-400 hover:text-gray-200 hover:bg-dark-hover"
              )
            }
          >
            {item.label}
          </HeadlessTab>
        ))}
      </TabList>
      <TabPanels className="mt-4">
        {items.map((item) => (
          <TabPanel key={item.label} className="animate-fade-in">
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
