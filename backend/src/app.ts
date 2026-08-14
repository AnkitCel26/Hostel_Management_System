import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "./graphql/typeDefs.ts";
import { resolvers } from "./graphql/resolvers.ts";
import { verifyAccessToken } from "./utils/jwt.ts";
import type { UserPayload } from "./graphql/types/context.types.ts";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await graphqlServer.start();

app.use(
  "/graphql",
  expressMiddleware(graphqlServer, {
    context: async ({ req, res }) => {
      const token = req.cookies?.accessToken;

      if (!token) return { req, res, user: null };

      try {
        const decodedUser = verifyAccessToken(token) as UserPayload;
        return { req, res, user: decodedUser };
      } catch (error) {
        return { req, res, user: null };
      }
    },
  }),
);

export default app;
