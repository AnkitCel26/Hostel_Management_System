import { GraphQLError } from "graphql";
import type { GraphQLContext } from "../graphql/types/context.types.ts";

export const requireAuth = (context: GraphQLContext) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required");
  }

  return context.user;
};

export const requireAdmin = (context: GraphQLContext) => {
  const user = requireAuth(context);

  if (user.role !== "admin") {
    throw new GraphQLError("Only admin can perform this action");
  }

  return user;
};