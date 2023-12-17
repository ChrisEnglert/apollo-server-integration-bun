import { ApolloServer, BaseContext, HeaderMap } from "@apollo/server"

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
      const body = JSON.parse(await req.text())
      const method = req.method
      const headers = new HeaderMap(req.headers)

      const gqlResponse = await apolloServer.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          body,
          method,
          headers,
          search: "",
        },
        context: () => context(req),
      })

      const responseBody = gqlResponse.body as {
        kind: "complete"
        string: string
      }

      const res = new Response(responseBody.string)
      return res
    },
    port,
  }
}
