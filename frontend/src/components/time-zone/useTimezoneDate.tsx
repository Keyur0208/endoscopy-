/* eslint perfectionist/sort-imports: "error" */
import { DateTime } from 'luxon';
import type { ReactNode } from 'react';
import React, { useMemo, useContext, useCallback, createContext } from 'react';
import { useAuthContext } from 'src/auth/hooks';

/* =========================================================
   TYPES
========================================================= */

interface TimezoneContextType {
  timezone: string;

  // UTC helpers (DateTime only)
  toUTC: (dateString: string) => string;
  fromUTC: (utcDateString: string, formatKey?: string) => string;

  // Current helpers (branch timezone)
  currentDateTime: () => string;
  currentDate: () => string;
  currentTime: () => string;
  currentDay: () => string;
  currentMonth: () => string;
  currentMonthNumber: () => string;
  currentYear: () => string;

  // Plain DB helpers (NO timezone)
  formatPlainToInputDate: (dateString?: string) => string;
  formatPlainToDisplayDate: (dateString?: string) => string;
  formatPlainTimeToInputTime: (timeString?: string) => string;
  formatPlainTimeToDisplayTime: (timeString?: string) => string;

  // DB DateTime (UTC → branch timezone)
  formatPlainDateTimeToDisplayDateTime: (dateString?: string) => string;
}

const TimezoneContext = createContext<TimezoneContextType | null>(null);

interface TimezoneProviderProps {
  children: ReactNode;
}

/* =========================================================
   PROVIDER
========================================================= */

export function TimezoneProvider({ children }: TimezoneProviderProps) {
  const { user } = useAuthContext();

  const timezone = user?.currentbranch?.timezone || 'Asia/Kolkata';

  /* =======================================================
     FORMAT MAP (memoized for hooks dependency safety)
  ======================================================= */

  const formats = useMemo(
    () => ({
      fullDateTime: 'dd LLL yyyy hh:mm a',
      shortDate: 'dd LLL yyyy',
      timeOnly: 'hh:mm a',
      inputDate: 'yyyy-MM-dd',
      inputDateTime: "yyyy-MM-dd'T'HH:mm",
      inputTime: 'HH:mm',
      displayDateTime: 'dd/MM/yyyy hh:mm a',
      day: 'cccc',
    }),
    []
  );

  /* =======================================================
     UTC CONVERTERS (DateTime ONLY)
  ======================================================= */

  const toUTC = useCallback(
    (dateString: string): string => {
      if (!dateString) return '';

      // Plain DATE → do NOT convert
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      const dt = DateTime.fromISO(dateString, { zone: timezone });
      return dt.isValid ? (dt.toUTC().toISO() ?? '') : '';
    },
    [timezone]
  );

  const fromUTC = useCallback(
    (utcDateString: string, formatKey: string = 'fullDateTime'): string => {
      if (!utcDateString) return '';

      const fmt = formats[formatKey as keyof typeof formats] || formatKey;
      const dt = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timezone);

      return dt.isValid ? dt.toFormat(fmt) : '';
    },
    [formats, timezone]
  );

  /* =======================================================
     CURRENT TIME HELPERS (BRANCH TZ)
  ======================================================= */

  const currentDateTime = useCallback(
    () => DateTime.now().setZone(timezone).toFormat(formats.inputDateTime),
    [formats.inputDateTime, timezone]
  );

  const currentDate = useCallback(
    () => DateTime.now().setZone(timezone).toFormat(formats.inputDate),
    [formats.inputDate, timezone]
  );

  const currentTime = useCallback(
    () => DateTime.now().setZone(timezone).toFormat(formats.inputTime),
    [formats.inputTime, timezone]
  );

  const currentDay = useCallback(
    () => DateTime.now().setZone(timezone).toFormat(formats.day),
    [formats.day, timezone]
  );

  const currentMonth = useCallback(
    () => DateTime.now().setZone(timezone).toFormat('LLLL'),
    [timezone]
  );

  const currentMonthNumber = useCallback(
    () => DateTime.now().setZone(timezone).toFormat('MM'),
    [timezone]
  );

  const currentYear = useCallback(
    () => DateTime.now().setZone(timezone).toFormat('yyyy'),
    [timezone]
  );

  /* =======================================================
     PLAIN DATE / TIME (NO TIMEZONE)
  ======================================================= */

  const formatPlainToInputDate = useCallback(
    (dateString?: string): string => {
      if (!dateString) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      let dt = DateTime.fromISO(dateString);
      if (!dt.isValid) {
        dt = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
      }
      return dt.isValid ? dt.toFormat(formats.inputDate) : '';
    },
    [formats.inputDate]
  );

  const formatPlainToDisplayDate = useCallback(
    (dateString?: string): string => {
      if (!dateString) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const dtPlain = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
        return dtPlain.isValid ? dtPlain.toFormat(formats.shortDate) : '';
      }
      let dt = DateTime.fromISO(dateString);
      if (!dt.isValid) {
        dt = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
      }

      return dt.isValid ? dt.toFormat(formats.shortDate) : '';
    },
    [formats.shortDate]
  );

  const formatPlainTimeToInputTime = useCallback(
    (timeString?: string): string => {
      if (!timeString) return '';

      const normalized = timeString.length === 5 ? `${timeString}:00` : timeString;
      const dt = DateTime.fromFormat(normalized, 'HH:mm:ss');

      return dt.isValid ? dt.toFormat(formats.inputTime) : '';
    },
    [formats.inputTime]
  );

  const formatPlainTimeToDisplayTime = useCallback(
    (timeString?: string): string => {
      if (!timeString) return '';

      const normalized = timeString.length === 5 ? `${timeString}:00` : timeString;
      const dt = DateTime.fromFormat(normalized, 'HH:mm:ss');

      return dt.isValid ? dt.toFormat(formats.timeOnly) : '';
    },
    [formats.timeOnly]
  );

  /* =======================================================
     DB DATETIME (UTC → BRANCH TZ)
  ======================================================= */

  const formatPlainDateTimeToDisplayDateTime = useCallback(
    (dateString?: string): string => {
      if (!dateString) return '';

      const dt = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(timezone);
      return dt.isValid ? dt.toFormat(formats.displayDateTime) : '';
    },
    [formats.displayDateTime, timezone]
  );

  /* =======================================================
     CONTEXT VALUE (memoized – ESLint safe)
  ======================================================= */

  const contextValue = useMemo(
    () => ({
      timezone,
      toUTC,
      fromUTC,
      currentDateTime,
      currentDate,
      currentTime,
      currentDay,
      currentMonth,
      currentMonthNumber,
      currentYear,
      formatPlainToInputDate,
      formatPlainToDisplayDate,
      formatPlainTimeToInputTime,
      formatPlainTimeToDisplayTime,
      formatPlainDateTimeToDisplayDateTime,
    }),
    [
      timezone,
      toUTC,
      fromUTC,
      currentDateTime,
      currentDate,
      currentTime,
      currentDay,
      currentMonth,
      currentMonthNumber,
      currentYear,
      formatPlainToInputDate,
      formatPlainToDisplayDate,
      formatPlainTimeToInputTime,
      formatPlainTimeToDisplayTime,
      formatPlainDateTimeToDisplayDateTime,
    ]
  );

  return <TimezoneContext.Provider value={contextValue}>{children}</TimezoneContext.Provider>;
}

/* =========================================================
   HOOK
========================================================= */

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext);

  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }

  return context;
}
