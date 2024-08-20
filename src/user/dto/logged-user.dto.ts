import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoggedUserDto {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}

@ObjectType()
export class LoggedUserResponse {
  @Field()
  token: string;
}
