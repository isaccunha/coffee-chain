import { Request } from 'express';

import { TokenPayloadType } from './tokenPayloadSchema.type';

export interface AuthRequest extends Request {
  user: TokenPayloadType;
}
