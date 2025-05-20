import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    @Transform(params => {
        if (params.obj.id) {
            return params.obj.id;
        }
        if (params.obj._id) {
            return params.obj._id.toString();
        }
        return undefined;
    }, { toClassOnly: true })
    id: string;

    @Expose()
    email: string;

    @Expose()
    name?: string;

    @Exclude()
    password: string;

    @Exclude()
    _id: string;
}