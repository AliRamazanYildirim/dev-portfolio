export type AdminLogoutSuccessResponse = {
    success: true;
    message: string;
};

export type AdminLogoutFailureResponse = {
    success: false;
    error?: string;
};

export type AdminLogoutResponse =
    | AdminLogoutSuccessResponse
    | AdminLogoutFailureResponse;
