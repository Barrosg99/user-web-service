import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User)
  async user(@Args('id', { type: () => ID }) id: string) {
    console.log(id);
    
    return {
      id: 'mockId' ,
      name:'Gabriel' ,
      doc:'41649555890',
      docType: 'cpf',
      createdAt: new Date('2024-08-06T21:00:00.000Z'),
      updatedAt: new Date('2024-08-06T21:00:00.000Z'),
    };
  }
}
