import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';
import { CreateCastMemberUseCase } from '../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberUseCase } from '../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { FindCastMemberUseCase } from '../../core/cast-member/application/use-cases/find-cast-member/find-cast-member.use-case';
import { SearchCastMembersUseCase } from '../../core/cast-member/application/use-cases/search-cast-member/search-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './cast-members.presenter';
import { SearchCastMemberDto } from './dto/search-cast-member.dto';
import { NotFoundError } from '../../core/shared/domain/errors/notFoundError';
import { CastMember } from '../../core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutput } from '../../core/cast-member/application/use-cases/common/cast-member-output';
import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';

@UseGuards(AuthGuard, CheckIsAdminGuard)
@Controller('cast-member')
export class CastMembersController {
  @Inject(CreateCastMemberUseCase)
  private createUseCase!: CreateCastMemberUseCase;

  @Inject(FindCastMemberUseCase)
  private findUseCase!: FindCastMemberUseCase;

  @Inject(UpdateCastMemberUseCase)
  private updateUseCase!: UpdateCastMemberUseCase;

  @Inject(SearchCastMembersUseCase)
  private searchUseCase!: SearchCastMembersUseCase;

  @Inject(DeleteCastMemberUseCase)
  private deleteUseCase!: DeleteCastMemberUseCase;

  constructor() {}

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(createCastMemberDto);
    return CastMembersController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCastMemberDto) {
    const output = await this.searchUseCase.execute(searchParamsDto);
    return new CastMemberCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findUseCase.execute({ cast_member_id: id });

    if (!result) {
      throw new NotFoundError(id, CastMember);
    }

    return CastMembersController.serialize(result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const result = await this.updateUseCase.execute({
      ...updateCastMemberDto,
      cast_member_id: id,
    });

    return CastMembersController.serialize(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUseCase.execute({ cast_member_id: id });
  }

  static serialize(output: CastMemberOutput) {
    return new CastMemberPresenter(output);
  }
}
