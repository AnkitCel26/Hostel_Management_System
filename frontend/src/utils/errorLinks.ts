import { ErrorLink } from "@apollo/client/link/error";
import { from, switchMap } from "rxjs";
import { refreshClient } from "./refreshClient";
import { REFRESH_TOKEN } from "../graphql/auth.api";

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  const isAuthError = error.message === "Authentication required";

  if (!isAuthError) {
    return;
  }

  return from(
    (async () => {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await refreshClient.mutate({
            mutation: REFRESH_TOKEN,
          });

          resolvePendingRequests();
        } catch (err) {
          pendingRequests = [];

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          throw err;
        } finally {
          isRefreshing = false;
        }
      } else {
        await new Promise<void>((resolve) => {
          pendingRequests.push(resolve);
        });
      }
    })(),
  ).pipe(switchMap(() => forward(operation)));
});
