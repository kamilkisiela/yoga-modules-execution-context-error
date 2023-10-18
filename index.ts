import express from "express";
import { createYoga } from "graphql-yoga";
import { parse, ExecutionResult } from "graphql";
import { useGraphQLModules } from "@envelop/graphql-modules";
import { app as dApp } from "./app.js";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";

// const app = express();
const yoga = createYoga({
  plugins: [useGraphQLModules(dApp)],
});

function assertSingleValue<TValue extends object>(
  value: TValue | AsyncIterable<TValue>
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error("Expected single value");
  }
}

function assertSuccessfulResponse(result: ExecutionResult) {
  if (result.errors) {
    console.log(result.errors[0].message);
    throw new Error("Expected successful response");
  }
}

async function main() {
  const executor = buildHTTPExecutor({
    fetch: yoga.fetch,
  });

  const result = await executor({
    document: parse(/* GraphQL */ `
      query users {
        users {
          id
          name
        }
      }
    `),
  });

  assertSingleValue(result);
  assertSuccessfulResponse(result);
}

main();
