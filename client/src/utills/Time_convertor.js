export default function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    let seconds = Math.floor((now - past) / 1000);
  
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    const intervals = [
      { label: "year", seconds: 365 * 24 * 60 * 60 },
      { label: "month", seconds: 30 * 24 * 60 * 60 },
      { label: "week", seconds: 7 * 24 * 60 * 60 },
      { label: "day", seconds: 24 * 60 * 60 },
      { label: "hour", seconds: 60 * 60 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 }
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const intervalSeconds = intervals[i].seconds;
      if (seconds >= intervalSeconds) {
        const value = Math.floor(seconds / intervalSeconds);
        return rtf.format(-value, intervals[i].label);
      }
    }
    return "just now";
  }

  

  