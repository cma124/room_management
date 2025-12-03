export const formatDate = (dateString = null) => {
  if (dateString) {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return dateString;
};

export const getDaysDifference = (start_date, end_date) => {
  if (start_date && end_date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const oneDayMilliSec = 1000 * 60 * 60 * 24;
    let differenceMilliSec = null;

    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate.getTime() > today.getTime()) {
      differenceMilliSec = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.round(differenceMilliSec / oneDayMilliSec) + 1 + " Days";
    } else if (
      today.getTime() >= startDate.getTime() &&
      today.getTime() <= endDate.getTime()
    ) {
      differenceMilliSec = Math.abs(endDate.getTime() - today.getTime());
      return Math.round(differenceMilliSec / oneDayMilliSec) + 1 + " Days Left";
    }
  } else {
    return null;
  }
};

export const checkInputDates = (start_date, end_date) => {
  if (start_date && end_date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (
      startDate.getTime() < today.getTime() &&
      endDate.getTime() < today.getTime()
    )
      return "start_date end_date < today";

    if (startDate.getTime() < today.getTime()) return "start_date < today";

    if (endDate.getTime() < today.getTime()) return "end_date < today";

    if (endDate.getTime() < startDate.getTime()) return "end_date < start_date";

    return true;
  } else {
    return null;
  }
};

// Function to calculate time difference
export const calculateTimeRemaining = (updated_date) => {
  const endDate = new Date(updated_date);
  const now = new Date();

  // Add three hours to endDate
  endDate.setHours(endDate.getHours() + 3);

  // Calculate difference in milliseconds
  const difference = endDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  // Convert milliseconds to hours, minutes, and seconds
  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor(difference / (1000 * 60 * 60));

  return { hours, minutes, seconds, expired: false };
};

// Formats time values
export const formatTime = (value) => {
  return value < 10 ? `0${value}` : value;
};
