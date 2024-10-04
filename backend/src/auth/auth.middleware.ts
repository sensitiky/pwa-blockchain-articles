import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in authorization header');
      throw new UnauthorizedException('No token found');
    }

    try {
      const decoded = this.jwtService.verify(token);
      (req as any).user = decoded;
      console.log('Token verified successfully', decoded);
      next();
    } catch (error) {
      console.log('Error verifying token', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
