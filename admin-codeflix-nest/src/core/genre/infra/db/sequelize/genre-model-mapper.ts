import { CategoryId } from '../../../../category/domain/category.aggregate';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Genre, GenreId } from '../../../domain/genre.aggregate';
import { GenreCategoryModel, GenreModel } from './genre-model';

export class GenreModelMapper {
  static toModelProps(entity: Genre) {
    const { categories_id, ...props } = entity.toJSON();
    return {
      ...props,
      categories_id: categories_id.map(
        (value) =>
          new GenreCategoryModel({
            category_id: value,
            genre_id: entity.genre_id.id,
          }),
      ),
    };
  }

  static toEntity(model: GenreModel): Genre {
    const genre = new Genre({
      genre_id: new GenreId(model.genre_id),
      name: model.name,
      categories_id: new Map(
        model.categories_id
          ? model.categories_id.map((item) => [
              item.category_id,
              new CategoryId(item.category_id),
            ])
          : [],
      ),
      is_active: model.is_active,
      created_at: model.created_at,
    });

    genre.validate();
    if (genre.notification.hasErrors()) {
      throw new EntityValidationError(genre.notification.toJSON());
    }
    return genre;
  }
}
