import { ApolloServer, BaseContext, HTTPGraphQLRequest, HeaderMap } from "@apollo/server"

export function apolloIntegration<TContext extends BaseContext>({
  apolloServer,
  port,
  context,
}: {
  apolloServer: ApolloServer<TContext>
  port: number
  context: (req: Request) => TContext | Promise<TContext>
}) {
  return {
    async fetch(req: Request): Promise<Response> {
      return await apolloRequest(req, apolloServer, context)
    },
    port,
  }
}

export async function apolloRequest<TContext extends BaseContext>(
  req: Request,
  apolloServer: ApolloServer<TContext>,
  context: (req: Request) => TContext | Promise<TContext>,
): Promise<Response> {
  const httpGraphQLRequest = await getRequest(req)

  const gqlResponse = await apolloServer.executeHTTPGraphQLRequest({
    httpGraphQLRequest,
    context: async () => context(req),
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
}

async function getRequest(req: Request): Promise<HTTPGraphQLRequest> {
  if (!req.method) {
    throw new Error("No method")
  }

  const method = req.method
  const headers = new HeaderMap(req.headers)
  const body = getBody(method, await req.text(), headers.get("content-type") || "")

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
  contentType: string,
): object | null {
  const isValidContentType = contentType.startsWith("application/json") || contentType.startsWith("application/graphql-response+json")
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
