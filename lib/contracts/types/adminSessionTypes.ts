export type AdminSessionUser = {
    id: string;
    email: string;
    name: string;
};

export type AdminSessionSuccessResponse = {
    success: true;
    authenticated: true;
    user: AdminSessionUser;
};

export type AdminSessionFailureResponse = {
    success: false;
    authenticated?: false;
    error?: string;
};

export type AdminSessionResponse =
    | AdminSessionSuccessResponse
    | AdminSessionFailureResponse;
