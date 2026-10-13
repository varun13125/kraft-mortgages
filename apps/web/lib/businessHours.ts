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
    // Fail CLOSED: if we can't determine Pacific time, queue the callback rather
    // than risk an automated call outside CRTC-permitted hours.
    return {
      isOpen: false,
      currentPtTime: "Pacific Time",
      nextAvailableTime: "Next Business Morning at 9:15 AM PT",
      dayName: "Mon",
      hour: 12,
      minute: 0,
    };
  }
}

// ---------------------------------------------------------------------------
// Recipient-local calling window (CRTC Unsolicited Telecommunications Rules,
// telemarketing hours: weekdays 9:00–21:30, weekends 10:00–18:00 in the
// RECIPIENT's local time). The office window above is Pacific-only, so an
// Ontario number could otherwise be called after 21:30 Eastern.
// The area code maps to every time zone it can belong to; the call is allowed
// only if it's inside the window in ALL of them (conservative). Unknown or
// non-Canadian numbers are checked against Pacific AND Eastern time.
// ---------------------------------------------------------------------------

const VANCOUVER = "America/Vancouver";
const EDMONTON = "America/Edmonton";
const REGINA = "America/Regina";
const WINNIPEG = "America/Winnipeg";
const TORONTO = "America/Toronto";
const MONCTON = "America/Moncton";
const HALIFAX = "America/Halifax";
const ST_JOHNS = "America/St_Johns";

const AREA_CODE_TIME_ZONES: Record<string, string[]> = {
  // British Columbia (250/236/672/778 also cover the Mountain-time East Kootenay)
  "604": [VANCOUVER],
  "250": [VANCOUVER, EDMONTON], "236": [VANCOUVER, EDMONTON], "257": [VANCOUVER, EDMONTON],
  "672": [VANCOUVER, EDMONTON], "778": [VANCOUVER, EDMONTON],
  // Alberta
  "368": [EDMONTON], "403": [EDMONTON], "587": [EDMONTON], "780": [EDMONTON], "825": [EDMONTON],
  // Saskatchewan
  "306": [REGINA], "474": [REGINA], "639": [REGINA],
  // Manitoba
  "204": [WINNIPEG], "431": [WINNIPEG], "584": [WINNIPEG],
  // Ontario (807 spans Eastern and Central)
  "226": [TORONTO], "249": [TORONTO], "289": [TORONTO], "343": [TORONTO], "365": [TORONTO],
  "382": [TORONTO], "416": [TORONTO], "437": [TORONTO], "519": [TORONTO], "548": [TORONTO],
  "613": [TORONTO], "647": [TORONTO], "683": [TORONTO], "705": [TORONTO], "742": [TORONTO],
  "753": [TORONTO], "905": [TORONTO], "942": [TORONTO], "807": [TORONTO, WINNIPEG],
  // Quebec
  "263": [TORONTO], "354": [TORONTO], "367": [TORONTO], "418": [TORONTO], "438": [TORONTO],
  "450": [TORONTO], "468": [TORONTO], "514": [TORONTO], "579": [TORONTO], "581": [TORONTO],
  "819": [TORONTO], "873": [TORONTO],
  // Atlantic
  "428": [MONCTON], "506": [MONCTON], "782": [HALIFAX], "902": [HALIFAX],
  "709": [ST_JOHNS], "879": [ST_JOHNS],
  // Territories
  "867": ["America/Whitehorse", "America/Yellowknife", "America/Iqaluit"],
};

/** Time zones a phone number may be in, from its NANP area code. */
export function recipientTimeZones(phone: string | null | undefined): string[] {
  const digits = (phone || "").replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  const areaCode = national.length === 10 ? national.slice(0, 3) : "";
  return AREA_CODE_TIME_ZONES[areaCode] ?? [VANCOUVER, TORONTO];
}

function withinCrtcWindow(timeZone: string, date: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday");
  const minutes = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
  const weekend = weekday === "Sat" || weekday === "Sun";
  return weekend
    ? minutes >= 10 * 60 && minutes <= 18 * 60
    : minutes >= 9 * 60 && minutes <= 21 * 60 + 30;
}

/**
 * True only when it's inside the CRTC window in every time zone the number may be in.
 * Fails closed (false) if the time can't be computed.
 */
export function isRecipientCallable(phone: string | null | undefined, date: Date = new Date()): boolean {
  try {
    return recipientTimeZones(phone).every((tz) => withinCrtcWindow(tz, date));
  } catch (err) {
    console.error("Error computing recipient calling window:", err);
    return false;
  }
}
