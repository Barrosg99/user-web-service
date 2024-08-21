import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUser = configService.get<string>('MONGO_USERNAME');
        const mongoPassword = configService.get<string>('MONGO_PASSWORD');
        const mongoHost = configService.get<string>('MONGO_HOST');
        const mongoPort = configService.get<string>('MONGO_PORT');
        const mongoDB = configService.get<string>('MONGO_DB');

        return {
          uri: `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDB}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req }) => {
        const jwtService = new JwtService({
          secret: process.env.JWT_SECRET,
        });

        const authHeader = req.headers.authorization;

        if (authHeader) {
          const token = authHeader;
          try {
            const decoded = jwtService.verify(token);
            return { userId: decoded.user.id };
          } catch (err) {
            throw new Error('Token Inválido');
          }
        }
      },
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    UserModule,
  ],
})
export class AppModule {}
