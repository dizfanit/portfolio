import { cases } from "./cases";

export const staticWorkItems = [
  {
    ...cases[0],
    number: "001",
    title: "Капитал",
    type: "Сайт / фирменный стиль",
    description:
      "Концепт сайта для финтех-платформы с акцентом на доверие, скорость и технологичность.",
    visual: "nexora",
    ratio: "1 / 1",
    ratioLabel: "1:1",
    category: "Сайты",
    favorite: true,
  },
  {
    ...cases[1],
    number: "002",
    title: "Нейрон",
    type: "Презентация",
    description:
      "Концепт презентации для AI-стартапа: продукт, технология и инвестиционная история.",
    visual: "astra",
    ratio: "1 / 1",
    ratioLabel: "1:1",
    category: "Презентации",
    favorite: true,
  },
  {
    ...cases[2],
    number: "003",
    visual: "void",
    ratio: "16 / 9",
    ratioLabel: "16:9",
    category: "Сайты",
    favorite: true,
  },
  {
    ...cases[3],
    number: "004",
    title: "Грань",
    type: "Фирменный стиль",
    description:
      "Концепт айдентики и упаковки бренда аксессуаров с монохромной эстетикой.",
    visual: "graphite",
    ratio: "1 / 1",
    ratioLabel: "1:1",
    category: "Избранное",
    favorite: true,
  },
  ...cases.slice(4).map((item, index) => ({
    ...item,
    number: String(index + 5).padStart(3, "0"),
    visual: `project-${String(index + 5).padStart(2, "0")}`,
    category: (["Сайты", "Презентации", "Сайты", "Социальные сети", "Сайты", "Печать", "Социальные сети", "Презентации", "Сайты", "Печать"] as const)[index],
    favorite: index <= 6,
    ratio: item.slug === "project-10" ? "2200 / 3070" : item.cover ? "16 / 9" : "1 / 1",
    ratioLabel: item.slug === "project-10" ? "2200:3070" : item.cover ? "16:9" : "1:1",
  })),
] as const;
