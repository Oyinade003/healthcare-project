import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class QueryResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}