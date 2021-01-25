import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      tracing: process.env.NODE_ENV !== 'production',
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req, res }: { req: Request; res: Response }): any => ({
        req,
        res,
      }),
      autoSchemaFile: join(process.cwd(), 'src/schemes/scheme.gql'),
    };
  }
}
