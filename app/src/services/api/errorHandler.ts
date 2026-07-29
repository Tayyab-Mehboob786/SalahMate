/**
 * SalahMate — API Error Handler (`src/services/api/errorHandler.ts`)
 *
 * Standardized API error representation and extraction utility.
 * Wraps raw Axios errors, network timeouts, and HTTP status codes into a predictable `ApiError`
 * object that can be safely consumed by TanStack Query hooks and UI components.
 */

import { isAxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public data?: unknown;
  public isNetworkError: boolean;

  constructor(
    message: string,
    status?: number,
    code?: string,
    data?: unknown,
    isNetworkError = false,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.isNetworkError = isNetworkError;

    // Maintain proper stack trace when available across environments
    const ErrorWithCapture = Error as unknown as {
      captureStackTrace?: (targetObject: object, constructorOpt?: unknown) => void;
    };
    if (typeof ErrorWithCapture.captureStackTrace === 'function') {
      ErrorWithCapture.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Parses any thrown exception or AxiosError into a standardized `ApiError` instance.
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as ApiErrorResponse | undefined;

    // Check for network connectivity or CORS failures
    const isNetworkError = !error.response && Boolean(error.request);

    // Extract backend error message or default to HTTP status description
    const message =
      responseData?.message ??
      responseData?.error ??
      error.message ??
      'An unexpected network error occurred';

    const code =
      responseData?.code ?? (error.code || (status ? `HTTP_${status}` : 'NETWORK_ERROR'));

    return new ApiError(message, status, code, responseData, isNetworkError);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, 'UNKNOWN_ERROR', undefined, false);
  }

  return new ApiError('An unknown error occurred', undefined, 'UNKNOWN_ERROR', error, false);
}
