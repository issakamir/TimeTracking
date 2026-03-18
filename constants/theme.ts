import {Dimensions} from "react-native";

export const SW      = Dimensions.get("window").width;
export const PADDING = 16;
export const CARD_PAD = 14;
export const CIRCLE  = Math.floor((SW - PADDING * 2 - CARD_PAD * 2) / 7) - 6;

export const C = {
  bg:       "#EBF0FA",
  card:     "#FFFFFF",
  dark:     "#0B1829",
  text:     "#18243F",
  textSec:  "#4B5E88",
  textTert: "#8A9DC0",
  blue1:    "rgba(59,130,246,0.13)",
  blue2:    "rgba(59,130,246,0.28)",
  blue3:    "rgba(37,99,235,0.55)",
  blue4:    "#2563EB",
  accent:   "#3B82F6",
  divider:  "#E4EAF6",
  selected: "#1E3A8A",
};