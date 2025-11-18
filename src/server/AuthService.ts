import { User } from "../../generated/prisma";
import ComparePasswordHash from "./bcrypt";
import { GenerateAuthToken } from "./jwt";
import UserService from "./UserSevice";

type LoginUserResponse = {
    token?: string;
    error: boolean;
    message: string;
    user?: Partial<User>;
};

type LoginUserProps = {
    email: string;
    password: string;
};

class AuthService {
    static async LoginStore(
        loginData: LoginUserProps,
    ): Promise<LoginUserResponse> {
        try {
            if (!loginData) return { error: true, message: "Invalid request" };
            const { email, password: pass } = loginData;
            if (!email || !pass) {
                return {
                    error: true,
                    message: "Email and password are required",
                };
            }

            const data = await UserService.getUserByEmail(email);

            if (!data || data.error) {
                return { error: true, message: "Invalid email or password" };
            }

            if (data.data && !data.data.active_status) {
                return {
                    error: true,
                    message:
                        "Sorry, your account has been deactivated, contact support.",
                };
            }

            if (data.data.should_delete) {
                return {
                    error: true,
                    message:
                        "Your account is scheduled for deletion. Please contact support.",
                };
            }

            const match = await ComparePasswordHash(pass, data.data.password);

            if (!match) {
                return { error: true, message: "Invalid email or password" };
            }

            const { password, ...rest } = data.data;

            const { accessToken } = await GenerateAuthToken(rest);

            return {
                token: accessToken,
                error: false,
                message: "Login Successful",
                user: rest,
            };
        } catch (error) {
            return { error: true, message: "Internal server error" };
        }
    }
}

export default AuthService;
