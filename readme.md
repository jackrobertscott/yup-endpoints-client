# yup-endpoints-client

A set of utilities for sending and receiving data from a yup endpoints server.

## Installation

```bash
npm install yup yup-endpoints-client
```

Or, if you prefer using Yarn:

```bash
yarn add yup yup-endpoints-client
```

## Usage

Here's a quick example to get you started:

```typescript
// Add your server url to the client
const client = new YupFetcherClient("http://your-domain.com")

// Define the endpoint
const createUserEndpoint = createYupEndpoint({
  path: "/create-user",
  in: yup.object({
    name: yup.string().required(),
    age: yup.number().required(),
  }),
})

// Create the endpoint fetcher function
const createUserFetcher = client.createYupEndpointFetcher(createUserEndpoint)

// Provide a TypeScript object
createUserFetcher({
  name: "John Smith",
  age: 45
})

// Or use FormData as the input
const formData = new FormData()
formData.set("name", "John Smith")
formData.set("age", "45")
createUserFetcher(formData)
```

## Contributing

Contributions are always welcome!

## License

This project is licensed under the [MIT License](LICENSE).

## Support

If you have any questions or issues, feel free to open an issue on the [GitHub repository](https://github.com/your-github/yup-endpoints-server).

## Acknowledgements

Special thanks to the contributors of this project and the Yup library for making input validation simpler and more efficient.