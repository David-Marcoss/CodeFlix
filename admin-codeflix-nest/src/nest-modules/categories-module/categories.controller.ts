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
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { SearchCategoriesDto } from './dto/search-category.dto';
import { CategoryOutput } from '../../core/category/application/use-cases/common/category-output';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase!: CreateCategoryUseCase;

  @Inject(FindCategoryUseCase)
  private findUseCase!: FindCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase!: UpdateCategoryUseCase;

  @Inject(SearchCategoriesUseCase)
  private searchUseCase!: SearchCategoriesUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase!: DeleteCategoryUseCase;

  constructor() {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.createUseCase.execute(createCategoryDto);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCategoriesDto) {
    const output = await this.searchUseCase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findUseCase.execute({ category_id: id });

    if (!result) {
      return null;
    }

    return CategoriesController.serialize(result);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const result = await this.updateUseCase.execute({
      ...updateCategoryDto,
      category_id: id,
    });

    return CategoriesController.serialize(result);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUseCase.execute({ category_id: id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
