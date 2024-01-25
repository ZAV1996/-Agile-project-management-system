import { Response, Req, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Tokens } from "src/auth/types";

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext) => {
    const jwtService = new JwtService();
    const request = context.switchToHttp().getRequest()
    const user = jwtService.decode(request.cookies.refresh);

    if (!data) return user;
    return user[data]
})