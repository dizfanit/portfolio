export const adminCategories = ["Сайты", "Презентации", "Печать", "Социальные сети", "Рекламные баннеры"] as const;
export type AdminCategory = typeof adminCategories[number];
export type CaseCategory = AdminCategory | "Избранное";
export type AdminMedia = { src: string; title: string; alt: string; width: number; height: number; kind: "image" | "website" };
export type AdminSections = Record<"about" | "task" | "problem" | "solution" | "visual" | "result", string[]>;
export type StoredCase = {
  id: string; slug: string; number: string; revision: number;
  title: string; type: string; year: string; industry: string; description: string;
  category: CaseCategory; favorite: boolean; status: "draft" | "published"; singleWork: boolean;
  cover: AdminMedia | null; media: AdminMedia[]; sections: AdminSections;
  source?: "builtin"; mediaLayout?: "pages"; deleted?: boolean;
  createdAt: string; updatedAt: string;
};
export type CaseInput = Omit<StoredCase, "id" | "slug" | "number" | "createdAt" | "updatedAt" | "revision" | "source" | "mediaLayout" | "deleted"> & { id?: string; revision?: number };


export type PublicCase = Pick<StoredCase,"slug" | "number" | "title" | "type" | "year" | "industry" | "description" | "category" | "favorite" | "cover" | "singleWork">;
