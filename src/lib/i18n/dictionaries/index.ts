import type { Lang } from "../config";
import type { Dict } from "../types";
import { ar } from "./ar";
import { fr } from "./fr";
import { en } from "./en";
import { es } from "./es";
import { it } from "./it";
import { de } from "./de";
import { nl } from "./nl";
import { ru } from "./ru";

/** كل قواميس الواجهة — الاستيراد المركزي */
export const DICTS: Record<Lang, Dict> = { ar, fr, en, es, it, de, nl, ru };
