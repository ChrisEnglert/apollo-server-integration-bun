<a href='https://www.apollographql.com/'><img src='https://avatars.githubusercontent.com/u/17189275?s=200' style="border-radius: 6px; margin-right: 6px" height='100' alt='Apollo Server'></a>


# Apollo Server Integration for bun

## **Introduction**

**An Apollo Server integration for use with bun.**

[Apollo Server Integrations](https://github.com/apollo-server-integrations)


## **Usage**

```typescript
import { ApolloServer, BaseContext } from "@apollo/server";
import apolloIntegration from "@as-integrations/bun";
// ...

const apolloServer = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
})

await apolloServer.start()

const server = Bun.serve(
    apolloIntegration({
      apolloServer,
      port,      
    }),
  )

```