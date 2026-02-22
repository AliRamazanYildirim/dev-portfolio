export type AdminLoginUser = {
    id: string;
    email: string;
    name: string;
};

export type AdminLoginSuccessResponse = {
    success: true;
    message: string;
    user: AdminLoginUser;
};

export type AdminLoginFailureResponse = {
    success: false;
    error?: string;
};

export type AdminLoginResponse =
    | AdminLoginSuccessResponse
    | AdminLoginFailureResponse;
