import { FetchError } from 'ofetch';

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errorMessages?: Array<{
    path?: string;
    message?: string;
  }>;
};

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof FetchError) {
    const response = error.data as ApiErrorResponse | undefined;

    if (response?.errorMessages?.length) {
      return response.errorMessages
        .map(errorMessage => errorMessage.message)
        .filter(Boolean)
        .join(', ');
    }

    if (response?.message) {
      return response.message;
    }

    if (error.response?.status === 401) {
      return 'Your session has expired. Please log in again.';
    }

    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.response?.status === 429) {
      return 'Too many requests. Please try again later.';
    }

    if (error.response?.status && error.response.status >= 500) {
      return 'Something went wrong on the server. Please try again later.';
    }

    if (!error.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
  }

  return 'Something went wrong. Please try again.';
}
