import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    //const token = req.headers?.authorization?.split(" ")[1].trim();
    next();
  }
}
