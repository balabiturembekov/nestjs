import { Controller, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const result = await this.authService.googleLogin(req.user);
        const redirectUrl = `http://localhost:5173/auth/google/redirect?token=${result.access_token}&email=${encodeURIComponent(result.user.email || '')}&avatar=${encodeURIComponent(result.user.avatar || '')}`;

        return res.redirect(redirectUrl)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Req() req) {
      return req.user;
    }
}
