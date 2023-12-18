import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import {
  CreateServerForIntegrationTestsOptions,
  defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite"
import { describe } from "bun:test"
import { apolloRequest } from "./apollo"

describe("Apollo apolloRequest test", () => {
  defineIntegrationTestSuite(
    async (serverOptions: ApolloServerOptions<BaseContext>, testOptions?: CreateServerForIntegrationTestsOptions) => {
      // console.log('serverOptions', serverOptions);
      // console.log('testOptions', testOptions);

      const port = 0

      const apolloServer = new ApolloServer({
        ...serverOptions,
      })
      await apolloServer.start()

      const server = Bun.serve({
        async fetch(req) {
          const url = new URL(req.url)
          if (url.pathname === "/") return new Response("Home page!", { status: 200 })
          if (url.pathname === "/graphql") return apolloRequest(req, apolloServer, async (req) => {
            return testOptions?.context || {}
          })
          return new Response("404!", {
            status: 404
          })
        },
        port,
      })

      const url = server.url.toString()
      console.log('returning server url', url);

      return {
        server: apolloServer,
        url,
        async extraCleanup() {
          server.stop()
        },
      }
    },
    {
      noIncrementalDelivery: true,
    },
  )
})
