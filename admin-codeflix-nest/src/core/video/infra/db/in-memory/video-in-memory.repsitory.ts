import { Video, VideoId } from '../../../domain/video.aggregate';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory.repository';
import {
  VideoFilter,
  IVideoRepository,
} from '../../../domain/video.repository';

export class VideoInMemoryRepository
  extends InMemorySearchableRepository<Video, Uuid, VideoFilter>
  implements IVideoRepository
{
  findByIds(ids: VideoId[]): Promise<Video[]> {
    throw new Error('Method not implemented.');
  }
  existsById(
    ids: VideoId[],
  ): Promise<{ exists: VideoId[]; not_exists: VideoId[] }> {
    throw new Error('Method not implemented.');
  }

  sortableFields: string[] = ['title', 'created_at'];

  protected async applyFilter(
    items: Video[],
    filter: VideoFilter | null,
  ): Promise<Video[]> {
    if (!filter) {
      return items;
    }

    const { categories_id, cast_members_id, genres_id, title } = filter;

    return items.filter((i) => {
      const hasName =
        title && i.title.toLowerCase().includes(title.toLowerCase());

      const hasCategoryId =
        categories_id?.length &&
        categories_id.some((id) => i.categories_id.has(id.id));

      const hasGenreId =
        genres_id?.length && genres_id.some((id) => i.genres_id.has(id.id));

      const hasCastMemberId =
        cast_members_id?.length &&
        cast_members_id.some((id) => i.cast_members_id.has(id.id));

      const filters = [
        hasName,
        hasCategoryId,
        hasGenreId,
        hasCastMemberId,
      ].filter((v) => v !== undefined);

      return filters.every((v) => v === true);
    });
  }

  protected applySort(
    items: Video[],
    sort: string | null,
    sort_dir: 'asc' | 'desc' | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => Video {
    return Video;
  }
}
