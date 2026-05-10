export const GetToday = (): string =>
  new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
