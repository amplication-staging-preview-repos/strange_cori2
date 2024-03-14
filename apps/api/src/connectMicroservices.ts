import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateKafkaClientOptions } from "./kafka/generateKafkaClientOptions";
import { MicroserviceOptions } from "@nestjs/microservices";
import supertokens from "supertokens-node";
import { generateSupertokensOptions } from "./auth/supertokens/generateSupertokensOptions";
import { STAuthFilter } from "./auth/supertokens/auth.filter";

export async function connectMicroservices(app: INestApplication) {
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(generateKafkaClientOptions(configService));

  app.enableCors({
    origin: [generateSupertokensOptions(configService).appInfo.websiteDomain],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true
  });

  app.useGlobalFilters(new STAuthFilter());
}
