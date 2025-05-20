import { Exclude, Expose, Transform } from 'class-transformer';

export class ContactResponseDto {
    @Expose()
    @Transform(params => {
        if (params.obj && typeof params.obj.id === 'string' && params.obj.id) {
            return params.obj.id;
        }
        if (params.obj && params.obj._id) {
            return params.obj._id.toString();
        }
        return undefined;
    }, { toClassOnly: true })
    readonly id: string;

    @Expose()
    readonly name: string;

    @Expose()
    readonly email: string;

    @Expose()
    readonly phone?: string;

    @Exclude()
    _id: string;
}
