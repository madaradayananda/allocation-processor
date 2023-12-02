import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { join } from 'path';
import { PingController } from './rnd/ping/ping.controller';
import { RndModule } from './rnd/rnd.module';
import UtilModule from './util/util.module';
import EmployeeModule from './employee/employee.module';
import AuthModule from './auth/auth.module';
import ServiceConfigModule from './service-configuration/service-configuration.module';
import NotificationModule from './notification/notification.module';
import WebinarApi from './employee/webinar-api.service';

const dataSources = () => ({
  webinar: new WebinarApi(),
});

@Module({
  imports: [
    EmployeeModule,
    AuthModule,
    ServiceConfigModule,
    NotificationModule,
    LoggerModule.forRootAsync({
      imports: [ServiceConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          pinoHttp: config.get('logger.pinoHttp'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ServiceConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('database.pg.hostname'),
          port: config.get('database.pg.port'),
          username: config.get('database.pg.username'),
          password: config.get('database.pg.password'),
          database: config.get('database.pg.database'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: config.get('database.pg.synchronize'),
        };
      },
    }),
    GraphQLFederationModule.forRootAsync({
      imports: [ServiceConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          dataSources,
          autoSchemaFile: true,
          playground: config.get('graphql.playground'),
          introspection: config.get('graphql.introspection'),
        };
      },
    }),
    UtilModule,
    RndModule,
  ],
  controllers: [PingController],
  providers: [],
})
export default class AppModule {}
