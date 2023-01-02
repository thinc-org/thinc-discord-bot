import { Module } from '@nestjs/common'

import { Subject } from 'rxjs'

import { REGISTER_COMMAND_SUBJECT } from './register-command.constant'
import { RegisterCommandService } from './register-command.service'

@Module({
  providers: [
    { provide: REGISTER_COMMAND_SUBJECT, useValue: new Subject() },
    RegisterCommandService,
  ],
  exports: [RegisterCommandService],
})
export class RegisterCommandModule {}
