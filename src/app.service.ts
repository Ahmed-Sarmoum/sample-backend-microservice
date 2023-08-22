import { Injectable, Inject } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user-dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './event/create-user.event';

@Injectable()
export class AppService {
  private readonly users: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequest) {
    console.log('====================================');
    console.log(createUserRequest.email);
    console.log('====================================');
    this.users.push(createUserRequest);
    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
    this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
  }

  getAnalytics() {
    console.log('im here');

    return this.analyticsClient.send({ cmd: 'get_analytics' }, {});
  }
}
