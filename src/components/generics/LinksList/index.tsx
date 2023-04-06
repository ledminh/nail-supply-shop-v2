import { FC, useEffect, useState } from "react";

import { LinkItem } from "@/types/item";

import List from "components/generics/List";
import Link from "next/link";

import { useRef } from "react";



export interface Props<T extends JSX.IntrinsicAttributes & LinkItem> {
    items: T[];
    ItemCPN: FC<T & {onPathChange?: (newPath:string)=> void}>;
    liClass?: string;
    ulClass?: string;
    linkClass?: string;
    horizontal?: boolean;
    activeItem?: {
        id: string;
        className: string;
    },
    
};




export default function LinksList<T extends JSX.IntrinsicAttributes & LinkItem>({
    items,
    ItemCPN,
    liClass,
    ulClass,
    linkClass,
    horizontal,
    activeItem,
    
}: Props<T>) {


    


    function LinkCPN(props: T ) {
        
        const [path, setPath] = useState(props.path);

        const onPathChange = (newPath: string) => {
            setPath(newPath);
        }
        
        return (
            <Link className={linkClass} href={path}>
                <ItemCPN {...props} onPathChange={onPathChange} />
            </Link>
        );
    }        



    
    return (
        <List items={items} activeItem={activeItem} ItemCPN={LinkCPN} liClass={liClass} ulClass={ulClass} horizontal={horizontal}/>
    );
}



