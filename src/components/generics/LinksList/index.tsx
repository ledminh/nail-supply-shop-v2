import { FC } from "react";

import { LinkItem } from "@/types";

import List from "components/generics/List";
import Link from "next/link";


export interface Props<T extends JSX.IntrinsicAttributes & LinkItem> {
    items: T[];
    ItemCPN: FC<T>;
    liClass?: string;
    ulClass?: string;
    linkClass?: string;
    horizontal?: boolean;
};

export default function LinksList<T extends JSX.IntrinsicAttributes & LinkItem>({
    items,
    ItemCPN,
    liClass,
    ulClass,
    linkClass,
    horizontal,
}: Props<T>) {

    const LinkCPN  = (props: T) => (
        <Link className={linkClass} href={props.path}>
            <ItemCPN {...props} />
        </Link>
    );

    return (
        <List items={items} ItemCPN={LinkCPN} liClass={liClass} ulClass={ulClass} horizontal={horizontal}/>
    );
}