import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server"
import {
  CreateServerForIntegrationTestsOptions,
  defineIntegrationTestSuite,
} from "@apollo/server-integration-testsuite"
import { describe } from "bun:test"
import { apolloIntegration } from "./apollo"

describe("Apollo integration test", () => {
  defineIntegrationTestSuite(
    async (serverOptions: ApolloServerOptions<BaseContext>, testOptions?: CreateServerForIntegrationTestsOptions) => {
      // console.log('serverOptions', serverOptions);
      // console.log('testOptions', testOptions);

      const port = 0

      const apolloServer = new ApolloServer({
        ...serverOptions,
      })
      await apolloServer.start()

      const server = Bun.serve(
        apolloIntegration({
          apolloServer,
          port,
          context: async (req) => {
            return testOptions?.context || {}
          },
        }),
      )

      const url = server.url.toString()
      // console.log('returning server url', url);

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
      serverIsStartedInBackground: true,
    },
  )
})
