import { format } from "date-fns";

export function formatDate(date) {
  try {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "N/A";
    return format(parsedDate, "MM/dd/yyyy");
  } catch (error) {
    return "N/A";
  }
}
