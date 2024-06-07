import * as Sentry from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { parseErrorMessage } from '@src/helpers/validator';
import React, { createContext, useContext, ReactNode, useCallback } from 'react';

interface ErrorLoggerArgs {
  error?: any;
  toastLog?: string | boolean | any;
  consoleLog?: string | boolean | any;
  extraData?: Record<string, any>;
}

const ErrorContext = createContext<(args: ErrorLoggerArgs) => void>(() => {});

export const ErrorLoggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const logError = useCallback(({ error, toastLog, consoleLog = error, extraData }: ErrorLoggerArgs) => {
    if (error) {
      Sentry.captureException(error, {
        extra: extraData,
      });
    }
    if (consoleLog !== false) {
      console.log(typeof consoleLog === 'string' ? consoleLog : error);
    }
    if (toastLog) {
      if (typeof toastLog === 'string') {
        toast.error(toastLog);
      } else if (toastLog === true) {
        toast.error(error.toString());
      } else {
        toast.error(parseErrorMessage(toastLog));
      }
    }
  }, []);

  return <ErrorContext.Provider value={logError}>{children}</ErrorContext.Provider>;
};

export const useErrorLogger = () => useContext(ErrorContext);
