<a href='https://www.apollographql.com/'><img src='https://avatars.githubusercontent.com/u/17189275?s=200' style="border-radius: 6px; margin-right: 6px" height='100' alt='Apollo Server'></a>
<a href="https://bun.sh" rel="nofollow"><img src="https://user-images.githubusercontent.com/709451/182802334-d9c42afe-f35d-4a7b-86ea-9985f73f20c3.png" alt="Logo" height="100" style="max-width: 100%;"></a>

# Apollo Server Integration for bun

## **Introduction**

**An Apollo Server integration for use with bun.**

[Apollo Server Integrations](https://github.com/apollo-server-integrations)


## **Usage**

### **Exclusive**
```typescript
import { apolloIntegration } from "@as-integrations/bun"
import { ApolloServer, BaseContext } from "@apollo/server"

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

### **Combined**

```typescript
import { apolloRequest } from "@as-integrations/bun"
import { ApolloServer, BaseContext } from "@apollo/server"

//..

const apolloServer = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
})

await apolloServer.start()

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === "/") return new Response("Home page!")
    if (url.pathname === "/graphql") return apolloRequest(req, apolloServer, async (req) => getContext(req))
    return new Response("404!")
  },
  port,
})
``