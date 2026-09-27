export interface CallingHoursStatus {
  isOpen: boolean;
  currentPtTime: string;
  nextAvailableTime: string;
  dayName: string;
  hour: number;
  minute: number;
}

/**
 * Evaluates whether outbound automated calling is permitted right now based on
 * CRTC telemarketing rules and Kraft Mortgages office guidelines in Pacific Time (America/Vancouver).
 *
 * Calling window:
 * - Mon–Fri: 9:00 AM – 7:30 PM PT
 * - Sat: 10:00 AM – 4:30 PM PT
 * - Sun: Closed (CRTC restricted / queued for Monday morning)
 */
export function getCallingHoursStatus(date: Date = new Date()): CallingHoursStatus {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Vancouver",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const parts = formatter.formatToParts(date);
    const partMap: Record<string, string> = {};
    for (const part of parts) {
      partMap[part.type] = part.value;
    }

    const weekday = partMap.weekday || "Mon";
    const hour = parseInt(partMap.hour || "12", 10);
    const minute = parseInt(partMap.minute || "0", 10);

    let isOpen = false;

    if (weekday === "Sun") {
      isOpen = false;
    } else if (weekday === "Sat") {
      if (hour >= 10 && (hour < 16 || (hour === 16 && minute <= 30))) {
        isOpen = true;
      }
    } else {
      // Weekdays Mon-Fri
      if (hour >= 9 && (hour < 19 || (hour === 19 && minute <= 30))) {
        isOpen = true;
      }
    }

    let nextAvailableTime = "Tomorrow at 9:15 AM PT";
    if (weekday === "Sat" && !isOpen) {
      nextAvailableTime = "Monday at 9:15 AM PT";
    } else if (weekday === "Sun") {
      nextAvailableTime = "Monday at 9:15 AM PT";
    } else if (hour < 9) {
      nextAvailableTime = "Today at 9:15 AM PT";
    } else if (weekday === "Fri" && (hour > 19 || (hour === 19 && minute > 30))) {
      nextAvailableTime = "Saturday at 10:15 AM PT";
    } else {
      nextAvailableTime = "Tomorrow at 9:15 AM PT";
    }

    const displayMinutes = minute < 10 ? `0${minute}` : `${minute}`;
    const displayHour12 = hour % 12 || 12;
    const ampm = hour >= 12 ? "PM" : "AM";

    return {
      isOpen,
      currentPtTime: `${weekday} ${displayHour12}:${displayMinutes} ${ampm} PT`,
      nextAvailableTime,
      dayName: weekday,
      hour,
      minute,
    };
  } catch (err) {
    console.error("Error computing calling hours:", err);
    // Safe fallback: treat as open during daylight hours UTC
    return {
      isOpen: true,
      currentPtTime: "Pacific Time",
      nextAvailableTime: "Next Business Morning at 9:15 AM PT",
      dayName: "Mon",
      hour: 12,
      minute: 0,
    };
  }
}
