import { CastMemberId } from '../../../cast-member/domain/cast-member.aggregate';
import { CategoryId } from '../../../category/domain/category.aggregate';
import { GenreId } from '../../../genre/domain/genre.aggregate';
import { EntityValidationError } from '../../../shared/domain/validators/validation.error';
import { Banner } from '../../domain/banner.vo';
import { Rating } from '../../domain/rating.vo';
import { Thumbnail } from '../../domain/thumbnail.vo';
import { ThumbnailHalf } from '../../domain/thumbnail_half.vo';
import { Trailer } from '../../domain/trailer.vo';
import { VideoMedia } from '../../domain/video-media.vo';
import { Video, VideoId } from '../../domain/video.aggregate';
import {
  AudioVideoMediaModel,
  AudioVideoRelatedField,
} from './audio-video.model';
import { ImageMediaModel, ImageMediaRelatedField } from './image-media.model';
import {
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenresModel,
  VideoModel,
} from './video-model';

export class VideoModelMapper {
  static toModelProps(entity: Video) {
    const json = entity.toJSON();
    const { categories_id, cast_members_id, genres_id } = json;
    const props = {
      video_id: json.video_id,
      title: json.title,
      description: json.description,
      year_launched: json.year_launched,
      duration: json.duration,
      rating: json.rating,
      is_opened: json.is_opened,
      is_published: json.is_published,
      created_at: json.created_at,
    };

    const image_medias = [
      { value: entity.banner, type: ImageMediaRelatedField.BANNER },
      { value: entity.thumbnail, type: ImageMediaRelatedField.THUMBNAIL },
      {
        value: entity.thumbnail_half,
        type: ImageMediaRelatedField.THUMBNAIL_HALF,
      },
    ]
      .filter((i) => i.value)
      .map((i) =>
        ImageMediaModel.build({
          name: i.value!.name,
          location: i.value!.location,
          video_id: props.video_id,
          image_media_related_field: i.type,
        } as any),
      );

    const audio_video_medias = [
      {
        value: entity.trailer,
        type: AudioVideoRelatedField.TRAILER,
      },
      { value: entity.video, type: AudioVideoRelatedField.VIDEO },
    ]
      .filter((i) => i.value)
      .map((i) =>
        AudioVideoMediaModel.build({
          name: i.value!.name,
          raw_location: i.value!.raw_location,
          video_id: props.video_id,
          audio_video_related_field: i.type,
          status: i.value!.status,
          encoded_location: i.value!.encoded_location,
        } as any),
      );

    return {
      ...props,
      audio_video_medias,
      image_medias,
      categories_id: categories_id.map(
        (value) =>
          new VideoCategoryModel({
            category_id: value,
            video_id: entity.video_id.id,
          }),
      ),
      genres_id: genres_id.map(
        (value) =>
          new VideoGenresModel({
            genre_id: value,
            video_id: entity.video_id.id,
          }),
      ),
      cast_members_id: cast_members_id.map(
        (value) =>
          new VideoCastMemberModel({
            cast_member_id: value,
            video_id: entity.video_id.id,
          }),
      ),
    };
  }

  static toEntity(model: VideoModel): Video {
    const {
      audio_video_medias = [],
      image_medias = [],
      cast_members_id: model_cast_mamber_id = [],
      categories_id: model_categories_id = [],
      genres_id: model_genres_id = [],
      rating: model_rating,
      ...otherData
    } = model.toJSON();

    const rating = Rating.create(model_rating);

    const categories_id = new Map(
      model_categories_id.map((item) => [
        item.category_id,
        new CategoryId(item.category_id),
      ]),
    );

    const cast_members_id = new Map(
      model_cast_mamber_id.map((item) => [
        item.cast_member_id,
        new CastMemberId(item.cast_member_id),
      ]),
    );

    const genres_id = new Map(
      model_genres_id.map((item) => [
        item.genre_id,
        new GenreId(item.genre_id),
      ]),
    );

    let thumbnail: Thumbnail | undefined;
    let thumbnail_half: ThumbnailHalf | undefined;
    let banner: Banner | undefined;
    let trailer: Trailer | undefined;
    let videoMedia: VideoMedia | undefined;

    image_medias.forEach((i) => {
      if (i.image_media_related_field === ImageMediaRelatedField.THUMBNAIL) {
        thumbnail = new Thumbnail({ name: i.name, location: i.location });
        return;
      } else if (
        i.image_media_related_field === ImageMediaRelatedField.THUMBNAIL_HALF
      ) {
        thumbnail_half = new ThumbnailHalf({
          name: i.name,
          location: i.location,
        });
        return;
      }

      banner = new Banner({ name: i.name, location: i.location });
    });

    audio_video_medias.forEach((v) => {
      if (v.audio_video_related_field === AudioVideoRelatedField.TRAILER) {
        trailer = new Trailer({
          name: v.name,
          raw_location: v.raw_location,
          status: v.status,
          encoded_location: v.encoded_location ?? undefined,
        });

        return;
      }

      videoMedia = new VideoMedia({
        name: v.name,
        raw_location: v.raw_location,
        status: v.status,
        encoded_location: v.encoded_location ?? undefined,
      });
    });

    const video = new Video({
      ...otherData,
      video_id: new VideoId(model.video_id),
      rating,
      cast_members_id,
      categories_id,
      genres_id,
      banner,
      thumbnail,
      thumbnail_half,
      trailer,
      video: videoMedia,
    });

    video.validate();
    if (video.notification.hasErrors()) {
      throw new EntityValidationError(video.notification.toJSON());
    }
    return video;
  }
}
