export type Customer = {
    id?: string;
    _id?: string;
    firstname?: string;
    lastname?: string;
    companyname?: string;
    email?: string;
    phone?: string;
    address?: string;
    projectStatus?: string;
    city?: string;
    postcode?: string;
    reference?: string;
    price?: number | null;
    finalPrice?: number | null;
    discountRate?: number | null;
    myReferralCode?: string;
    referralCount?: number;
    totalEarnings?: number;
    created_at?: string | null;
};

export type FetchCustomersOptions = {
    sort?: string;
    from?: string;
    to?: string;
    q?: string;
};
