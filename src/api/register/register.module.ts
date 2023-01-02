import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'

import { RegisterService } from './register.service'

@Module({
  imports: [PrismaModule],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
