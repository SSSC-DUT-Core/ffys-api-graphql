import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { CreateAccountDto, SignInDto, ReturnAccountDto, ReturnTokenDto } from './dtos/auth.dto'
import { ReturnMessageBase } from 'src/common/interface/returnBase'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Person } from 'src/common/decorators/person.decorator'
import { PersonEntity } from 'src/db/entities/person'
import { UseGuards } from '@nestjs/common'
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard'

interface MyContext {
  req: {
    headers: {
      authorization: string
    }
  }
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ReturnAccountDto, { name: 'signUp' })
  async signUp(@Args('input') input: CreateAccountDto) {
    return await this.authService.signUp(input)
  }

  @Mutation(() => ReturnAccountDto, { name: 'signIn' })
  async signIn(@Args('input') input: SignInDto, @Context() context: MyContext) {
    const authorization = context.req.headers.authorization
    return await this.authService.signIn(input, authorization)
  }

  @Auth()
  @Query(() => ReturnMessageBase, { name: 'logOut' })
  async logOut(@Person() person: PersonEntity) {
    return await this.authService.logOut(person.id)
  }

  @UseGuards(RefreshTokenGuard)
  @Query(() => ReturnTokenDto, { name: 'refreshToken' })
  async refreshToken(@Person() person: PersonEntity) {
    return await this.authService.refreshToken(person.id, person.refreshToken)
  }
}
