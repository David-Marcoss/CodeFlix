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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CreateGenreUseCase } from '../../core/genre/application/use-cases/create-genre/create-genre.use-case';
import { UpdateGenreUseCase } from '../../core/genre/application/use-cases/update-genre/update-genre.use-case';
import { FindGenreUseCase } from '../../core/genre/application/use-cases/find-genre/find-genre.use-case';
import { SearchGenresUseCase } from '../../core/genre/application/use-cases/search-genres/search-genres.use-case';
import { DeleteGenreUseCase } from '../../core/genre/application/use-cases/delete-genre/delete-genre.use-case';
import { GenreCollectionPresenter, GenrePresenter } from './genre.presenter';
import { SearchGenresDto } from './dto/search-genre.dto';
import { GenreOutput } from '../../core/genre/application/use-cases/common/genre-output';
import { NotFoundError } from '../../core/shared/domain/errors/notFoundError';
import { Genre } from '../../core/genre/domain/genre.aggregate';
import { CategoryId } from '../../core/category/domain/category.aggregate';
import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';

@UseGuards(AuthGuard, CheckIsAdminGuard)
@Controller('genres')
export class GenreController {
  @Inject(CreateGenreUseCase)
  private createUseCase!: CreateGenreUseCase;

  @Inject(FindGenreUseCase)
  private findUseCase!: FindGenreUseCase;

  @Inject(UpdateGenreUseCase)
  private updateUseCase!: UpdateGenreUseCase;

  @Inject(SearchGenresUseCase)
  private searchUseCase!: SearchGenresUseCase;

  @Inject(DeleteGenreUseCase)
  private deleteUseCase!: DeleteGenreUseCase;

  constructor() {}

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    const output = await this.createUseCase.execute(createGenreDto);
    return GenreController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto?: SearchGenresDto) {
    if (!searchParamsDto) {
      const output = await this.searchUseCase.execute({});
      return new GenreCollectionPresenter(output);
    }

    const { filter, ...params } = searchParamsDto;
    const searchParams = {
      ...params,
      filter: {
        name: filter?.name,
        categories_id: filter?.categories_id?.map((i) => new CategoryId(i)),
      },
    };

    const output = await this.searchUseCase.execute(searchParams);
    return new GenreCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findUseCase.execute({ genre_id: id });

    if (!result) {
      throw new NotFoundError(id, Genre);
    }

    return GenreController.serialize(result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const result = await this.updateUseCase.execute({
      ...updateGenreDto,
      genre_id: id,
    });

    return GenreController.serialize(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUseCase.execute({ genre_id: id });
  }

  static serialize(output: GenreOutput) {
    return new GenrePresenter(output);
  }
}
