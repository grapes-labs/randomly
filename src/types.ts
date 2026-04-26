import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  icon: LucideIcon;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  techName?: string;
  techUrl?: string;
}

export interface Category {
  name: string;
  icon: LucideIcon;
  tools: Tool[];
}
