// src/utils/response.utils.ts

interface SuccessResponse<T> {
    succeeded: boolean;
    httpStatusCode: number;
    message: string;
    data: T;
  }
  
  interface ErrorResponse {
    succeeded: boolean;
    httpStatusCode: number;
    message: string;
  }
  
  /**
   * Format a success response.
   * @param message The success message to be returned.
   * @param data The data to be returned in the response.
   * @param statusCode The HTTP status code (default is 200).
   */
  export function successResponse<T>(
    data: T,
    message: string,
    statusCode: number = 200,
  ): SuccessResponse<T> {
    return {
      succeeded: true,
      httpStatusCode: statusCode,
      message: message,
      data: data,
    };
  }
  
  /**
   * Format an error response.
   * @param message The error message to be returned.
   * @param statusCode The HTTP status code (default is 500 for internal server error).
   */
  export function errorResponse(
    message: string,
    statusCode: number = 500,
  ): ErrorResponse {
    return {
      succeeded: false,
      httpStatusCode: statusCode,
      message: message,
    };
  }
  