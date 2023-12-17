import { ApolloServer, BaseContext, HTTPGraphQLRequest, HeaderMap } from "@apollo/server"

export function apolloIntegration<TContext extends BaseContext>({
  apolloServer,
  port,
  context,
}: {
  apolloServer: ApolloServer<TContext>
  port: number
  context: (req: Request) => Promise<TContext>
}) {
  return {
    async fetch(req: Request): Promise<Response> {
      const httpGraphQLRequest = await getRequest(req)

      const gqlResponse = await apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest,
        context: () => context(req),
      })

      const responseBody = gqlResponse.body as {
        kind: "complete"
        string: string
      }

      const res = new Response(responseBody.string, {
        status: gqlResponse.status || 200,
        headers: gqlResponse.headers.entries(),
      })
      return res
    },
    port,
  }
}

async function getRequest(req: Request): Promise<HTTPGraphQLRequest> {
  if (!req.method) {
    throw new Error("No method")
  }

  const method = req.method
  const headers = new HeaderMap(req.headers)
  const body = getBody(method, await req.text(), headers.get("content-type"))

  return {
    method,
    headers,
    search: new URL(req.url).search,
    body,
  }
}

function getBody(
  method: string | undefined,
  body: string | null | undefined,
  contentType: string | undefined,
): object | null {
  const isValidContentType = contentType?.startsWith("application/json")
  const isValidPostRequest = method === "POST" && isValidContentType

  if (isValidPostRequest) {
    if (typeof body === "string") {
      return JSON.parse(body)
    }
    if (typeof body === "object") {
      return body
    }
  }

  return null
}
