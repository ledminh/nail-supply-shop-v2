export interface Item {
    id: string;
}

export interface LinkItem extends Item {
    path: string;
}

export interface NavigationItem extends LinkItem  {
    label: string;
};
