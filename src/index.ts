export * from "yup-endpoints"

import * as yup from "yup"
import { YupEndpoint } from "yup-endpoints"

/**
 * A client for fetching data from endpoints using Yup schemas for validation.
 */
export class YupFetcherClient {
  /**
   * The base URL for the fetch requests.
   */
  url: string

  /**
   * Creates a new YupFetcherClient.
   * @param url - The base URL for the fetch requests.
   */
  constructor(url: string) {
    this.url = url
  }

  /**
   * Creates a fetcher function for a given Yup endpoint.
   * @param endpoint - The endpoint definition with input and output schemas.
   * @returns A function that fetches data from the specified endpoint and validates it using the provided Yup schemas.
   */
  createYupEndpointFetcher<I extends yup.Schema, O extends yup.Schema>(
    endpoint: YupEndpoint<I, O>
  ) {
    return async (
      data: FormData | yup.InferType<I>,
      headers?: Record<string, string>
    ): Promise<O extends yup.Schema ? yup.InferType<O> : Response> => {
      const fetchOptions = {
        method: "POST",
        headers: { ...headers },
        body: data,
      } satisfies RequestInit
      if (!(data instanceof FormData)) {
        fetchOptions.body = JSON.stringify(data)
        fetchOptions.headers["Content-Type"] = "application/json"
      }
      const response = await fetch(this.url + endpoint.path, fetchOptions)
      const contentType = response.headers.get("Content-Type")
      const isJsonResponse = contentType?.startsWith("application/json")
      if (response.status >= 200 && response.status < 300) {
        if (isJsonResponse) {
          const data = await response.json()
          if (data && typeof data === "object" && "payload" in data) {
            return data.payload
          } else {
            throw new Error("Malformed response")
          }
        } else {
          return response as any
        }
      } else {
        if (isJsonResponse) {
          const data = await response.json()
          if (data && typeof data === "object" && "error" in data) {
            throw new HttpError(response.status, data.error)
          }
        }
        throw new HttpError(response.status, "Server request failed")
      }
    }
  }
}

/**
 * Represents an HTTP error with a status code and message.
 */
export class HttpError extends Error {
  /**
   * The HTTP status code for the error.
   */
  statusCode: number

  /**
   * Creates a new HttpError.
   * @param statusCode - The HTTP status code for the error.
   * @param message - The error message.
   */
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = "HttpError"
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError)
    }
  }
}
