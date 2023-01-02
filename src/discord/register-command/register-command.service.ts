import { Inject, Injectable } from '@nestjs/common'

import { Subject } from 'rxjs'

import { REGISTER_COMMAND_SUBJECT } from './register-command.constant'

@Injectable()
export class RegisterCommandService {
  constructor(
    @Inject(REGISTER_COMMAND_SUBJECT)
    private readonly registerCommandSubject: Subject<any>,
  ) {}

  triggerRegisterCommand() {
    this.registerCommandSubject.next(true)
  }

  getSubject() {
    return this.registerCommandSubject
  }
}
