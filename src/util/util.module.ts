import { RedisModule } from "@nestjs-modules/ioredis";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { M3ClientService } from "./m3-client.service";
import ServiceConfigModule from "src/service-configuration/service-configuration.module";
import CacheService from "./cache.service";
import HttpClientService from "./http-client.service";

@Module({
  imports: [
    HttpModule,
    RedisModule.forRootAsync({
      imports: [ServiceConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get("database.redis.host"),
          port: config.get("database.redis.port"),
          username: config.get("database.redis.username"),
          password: config.get("database.redis.password"),
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
  providers: [CacheService, HttpClientService, M3ClientService],
  exports: [HttpClientService, M3ClientService, CacheService],
})
export default class UtilModule {}
