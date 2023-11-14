import * as yup from "yup"
import { HttpError, YupFetcherClient, createYupEndpoint } from "."

describe("YupFetcherClient", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create an instance with a provided URL", () => {
    const client = new YupFetcherClient("http://example.com")
    expect(client.url).toBe("http://example.com")
  })

  describe("createYupEndpointFetcher", () => {
    const inputSchema = yup.object().shape({ name: yup.string().required() })
    const outputSchema = yup.object().shape({ message: yup.string() })
    const endpoint = createYupEndpoint({
      path: "/test",
      in: inputSchema,
      out: outputSchema,
    })

    it("should make a POST request with correct data", async () => {
      const client = new YupFetcherClient("http://example.com")
      const fetcher = client.createYupEndpointFetcher(endpoint)
      // todo
    })
  })
})

describe("HttpError", () => {
  it("should create an error with a status code and message", () => {
    const error = new HttpError(404, "Not Found")
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe("Not Found")
    expect(error.name).toBe("HttpError")
  })
})
