export interface SessionPayload {
    authenticated: boolean;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
