import { format } from "date-fns";

export function formatDate(date) {
  try {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "N/A";
    return format(parsedDate, "dd/MM/yyyy");
  } catch (error) {
    return "N/A";
  }
}
