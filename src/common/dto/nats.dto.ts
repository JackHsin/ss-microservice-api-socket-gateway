import { plainToClass, Expose } from 'class-transformer';

export class NatsPubBodyDTO {
  @Expose()
  event: string;

  @Expose()
  payload?: Record<any, any>;

  // TODO 未來需要被定義
  @Expose()
  meta?: Record<any, any>;

  static plainToClass(item: NatsPubBodyDTO) {
    return plainToClass(NatsPubBodyDTO, item, {
      excludeExtraneousValues: true,
    });
  }
}
