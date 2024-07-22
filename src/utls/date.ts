export function isDateMoreThan24HoursInFuture(date: any) {
  if (!date) return;

  const givenDate = new Date(date);

  const currentDate = new Date();
  const currentDatePlus24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  return givenDate > currentDatePlus24Hours;
}
