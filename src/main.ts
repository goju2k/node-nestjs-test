import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

//axios setup
import './common/axios/setup'

//guards
import AuthGuard from './nest/guards/auth.guard'

//interceptors
import MainInterceptor from './nest/interceptors/main.interceptor';

//request store init
import './common/header/header'

declare const module: any

//app start
async function bootstrap() {

  //app
  const app = await NestFactory.create(AppModule);

  //guards
  app.useGlobalGuards(new AuthGuard());

  //interceptors
  app.useGlobalInterceptors(new MainInterceptor());

  //swagger
  const config = new DocumentBuilder()
    .setTitle('BFF example')
    .setDescription('BFF for RTB Global')
    .setVersion(require('../package.json').version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  //start
  await app.listen(3000);

  if(module.hot){
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  
}

bootstrap();
