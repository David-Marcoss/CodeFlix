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
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '../../core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/use-cases/update-category/update-category.use-case';
import { FindCategoryUseCase } from '../../core/category/application/use-cases/find-category/find-category.use-case';
import { SearchCategoriesUseCase } from '../../core/category/application/use-cases/search-categories/search-categories.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/use-cases/delete-category/delete-category.use-case';
import { CategoryCollectionPresenter } from './categories.presenter';
import { SearchCategoriesDto } from './dto/search-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUsecase!: CreateCategoryUseCase;

  @Inject(FindCategoryUseCase)
  private findUsecase!: FindCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUsecase!: UpdateCategoryUseCase;

  @Inject(SearchCategoriesUseCase)
  private searchUsecase!: SearchCategoriesUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUsecase!: DeleteCategoryUseCase;

  constructor() {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.createUsecase.execute(createCategoryDto);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCategoriesDto) {
    const output = await this.searchUsecase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findUsecase.execute({ category_id: id });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateUsecase.execute({
      ...updateCategoryDto,
      category_id: id,
    });
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUsecase.execute({ category_id: id });
  }
}
