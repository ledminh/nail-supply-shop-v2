type PrismaProduct = {
    id: string;
    name: string;
    price: number;
    images: string[];
    intro: string;
    details: string;
    categoryID: string;
    groupID: string | null;
    dateCreated: Date;
    lastUpdated: Date;
    sellCount: number;
}

type PrismaProductGroup = {
    id: string;
    name: string;
    categoryID: string;
    dateCreated: Date;
    lastUpdated: Date;
}