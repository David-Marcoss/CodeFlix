import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { ValueObject } from '../../shared/domain/value-object';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { CategoryId } from '../../category/domain/category.aggregate';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { CastMemberId } from '../../cast-member/domain/cast-member.aggregate';
import { Rating } from './rating.vo';
import { Banner } from './banner.vo';
import { Thumbnail } from './thumbnail.vo';
import { ThumbnailHalf } from './thumbnail_half.vo';
import { VideoMedia } from './video-media.vo';
import { Trailer } from './trailer.vo';
import { VideoValidatorFactory } from './video.validator';
import { AudioVideoMediaStatus } from '../../shared/domain/value-objects/audio-video-media.vo';
import { VideoCreatedEvent } from './domain-events/video-created.event';
import { VideoAudioMediaReplaced } from './domain-events/audio-video-media-replaced.event';
import { VideoFakeBuilder } from './video-fake-builder';

export class VideoId extends Uuid {}

export type CreateVideoProps = {
  video_id?: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number; // minutes
  rating: Rating;

  banner?: Banner;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;

  video?: VideoMedia;
  trailer?: Trailer;

  is_opened: boolean;
  is_published: boolean;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;

  created_at?: Date;
};

export type CreateVideoComand = {
  title: string;
  description: string;
  year_launched: number;
  duration: number; // minutes
  rating: Rating;

  banner?: Banner;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;

  video?: VideoMedia;
  trailer?: Trailer;

  is_opened: boolean;

  categories_id: CategoryId[];
  genres_id: GenreId[];
  cast_members_id: CastMemberId[];
};

export class Video extends AggregateRoot {
  video_id: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number; // minutes
  rating: Rating;

  banner: Banner | null;
  thumbnail: Thumbnail | null;
  thumbnail_half: ThumbnailHalf | null;

  video: VideoMedia | null;
  trailer: Trailer | null;

  is_opened: boolean;
  is_published: boolean;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;

  created_at: Date;

  constructor(props: CreateVideoProps) {
    super();
    this.video_id = props.video_id || new VideoId();
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;
    this.rating = props.rating;
    this.banner = props.banner ?? null;
    this.thumbnail = props.thumbnail ?? null;
    this.thumbnail_half = props.thumbnail_half ?? null;
    this.video = props.video ?? null;
    this.trailer = props.trailer ?? null;
    this.is_opened = props.is_opened;
    this.is_published = props.is_published;
    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at ?? new Date();

    // Registra evento de criação do vídeo
    this.registerHandler(
      VideoCreatedEvent.name,
      this.onVideoCreated.bind(this),
    );

    // Registra evento de substituição de mídia de áudio/vídeo
    this.registerHandler(
      VideoAudioMediaReplaced.name,
      this.onAudioMediaReplaced.bind(this),
    );
  }

  static create(props: CreateVideoComand) {
    const instance = new Video({
      ...props,
      is_published: false,
      categories_id: new Map(
        props.categories_id.map((item) => [item.id, item]),
      ),
      genres_id: new Map(props.genres_id.map((item) => [item.id, item])),
      cast_members_id: new Map(
        props.cast_members_id.map((item) => [item.id, item]),
      ),
    });
    instance.validate();

    // Dispara o evento de criação do vídeo
    instance.applyEvent(
      new VideoCreatedEvent({
        video_id: instance.video_id,
        title: instance.title,
        description: instance.description,
        year_launched: instance.year_launched,
        duration: instance.duration,
        rating: instance.rating,
        is_opened: instance.is_opened,
        is_published: instance.is_published,
        banner: instance.banner,
        thumbnail: instance.thumbnail,
        thumbnail_half: instance.thumbnail_half,
        trailer: instance.trailer,
        video: instance.video,
        categories_id: Array.from(instance.categories_id.values()),
        genres_id: Array.from(instance.genres_id.values()),
        cast_members_id: Array.from(instance.cast_members_id.values()),
        created_at: instance.created_at,
      }),
    );

    return instance;
  }

  changeTitle(title: string): void {
    this.title = title;
    this.validate(['title']);
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  changeYear(year_launched: number): void {
    this.year_launched = year_launched;
  }

  changeDuration(duration: number): void {
    this.duration = duration;
  }

  changeRating(rating: Rating): void {
    this.rating = rating;
  }

  markAsOpened(): void {
    this.is_opened = true;
  }

  markAsNotOpened(): void {
    this.is_opened = false;
  }

  replaceBanner(banner: Banner): void {
    this.banner = banner;
  }

  replaceThumbnail(thumbnail: Thumbnail): void {
    this.thumbnail = thumbnail;
  }

  replaceThumbnailHalf(thumbnail_half: ThumbnailHalf): void {
    this.thumbnail_half = thumbnail_half;
  }

  replaceVideo(video: VideoMedia): void {
    this.video = video;
    this.tryMarkVideoAsPublished();

    // Dispara o evento de substituição de mídia de vídeo
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: video,
        media_type: 'video',
      }),
    );
  }

  replaceTrailer(trailer: Trailer): void {
    this.trailer = trailer;
    this.tryMarkVideoAsPublished();

    // Dispara o evento de substituição de mídia de trailer
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: trailer,
        media_type: 'trailer',
      }),
    );
  }

  private tryMarkVideoAsPublished() {
    if (
      this.video &&
      this.trailer &&
      this.video.status === AudioVideoMediaStatus.COMPLETED &&
      this.trailer.status === AudioVideoMediaStatus.COMPLETED
    ) {
      this.is_published = true;
    }
  }

  addCategoryId(category_id: CategoryId) {
    this.categories_id.set(category_id.id, category_id);
  }

  deleteCategoryId(category_id: CategoryId) {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(catefories_id: CategoryId[]) {
    if (catefories_id.length === 0) {
      return;
    }

    this.categories_id = new Map(catefories_id.map((item) => [item.id, item]));
  }

  addGenreId(genre_id: GenreId) {
    this.genres_id.set(genre_id.id, genre_id);
  }

  deleteGenreId(genre_id: GenreId) {
    this.genres_id.delete(genre_id.id);
  }

  syncGenresId(genres_id: GenreId[]) {
    if (genres_id.length === 0) {
      return;
    }

    this.genres_id = new Map(genres_id.map((item) => [item.id, item]));
  }

  addCastMemberId(cast_member_id: CastMemberId) {
    this.cast_members_id.set(cast_member_id.id, cast_member_id);
  }

  deleteCastMemberId(cast_member_id: CastMemberId) {
    this.cast_members_id.delete(cast_member_id.id);
  }

  syncCastMembersId(cast_members_id: CastMemberId[]) {
    if (cast_members_id.length === 0) {
      return;
    }

    this.cast_members_id = new Map(
      cast_members_id.map((item) => [item.id, item]),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onVideoCreated(_event: VideoCreatedEvent) {
    if (this.is_published) {
      return;
    }

    this.tryMarkVideoAsPublished();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAudioMediaReplaced(_event: VideoAudioMediaReplaced) {
    if (this.is_published) {
      return;
    }

    this.tryMarkVideoAsPublished();
  }

  validate(fields?: string[]) {
    const validator = VideoValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      video_id: this.video_id.id,
      title: this.title,
      description: this.description,
      year_launched: this.year_launched,
      duration: this.duration,
      rating: this.rating.value,
      is_opened: this.is_opened,
      is_published: this.is_published,
      banner: this.banner?.toJSON(),
      thumbnail: this.thumbnail?.toJSON(),
      thumbnail_half: this.thumbnail_half?.toJSON(),
      video: this.video?.toJSON(),
      trailer: this.trailer?.toJSON(),
      categories_id: Array.from(this.categories_id.values()).map(
        (category_id) => category_id.id,
      ),
      genres_id: Array.from(this.genres_id.values()).map(
        (genre_id) => genre_id.id,
      ),
      cast_members_id: Array.from(this.cast_members_id.values()).map(
        (cast_member_id) => cast_member_id.id,
      ),
      created_at: this.created_at,
    };
  }

  static fake() {
    return VideoFakeBuilder;
  }

  get entity_id(): ValueObject {
    return this.video_id;
  }
}
