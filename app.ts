import "reflect-metadata";
import {
  ExecutionContext,
  Injectable,
  Scope,
  createApplication,
  createModule,
  gql,
} from "graphql-modules";

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class Logger {
  @ExecutionContext()
  private context: ExecutionContext;

  info(message: string) {
    console.log({
      level: "info",
      message,
      context: this.context,
    });
  }
}

export const app = createApplication({
  modules: [
    createModule({
      id: "users",

      typeDefs: gql(`
        type Query {
          users: [User!]!
        }

        type User {
          id: ID!
          name: String!
        }
      `),
      resolvers: {
        Query: {
          users(_: unknown, __: unknown, { injector }: GraphQLModules.Context) {
            const logger = injector.get(Logger);

            logger.info("Fetching users");

            return [
              { id: "1", name: "Sarah" },
              { id: "2", name: "John" },
            ];
          },
        },
      },
      providers: [Logger],
    }),
  ],
});
