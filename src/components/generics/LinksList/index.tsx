import { FC, useEffect, useState } from "react";

import { LinkItem } from "@/types/item";

import List from "components/generics/List";
import { useRouter } from "next/router";

export interface Props<T extends JSX.IntrinsicAttributes & LinkItem> {
  items: T[];
  ItemCPN: FC<T & { onPathChange?: (newPath: string) => void }>;
  liClass?: string;
  ulClass?: string;
  linkClass?: string;
  horizontal?: boolean;
  activeItem?: {
    id: string;
    className: string;
  };
}

export default function LinksList<
  T extends JSX.IntrinsicAttributes & LinkItem
>({
  items,
  ItemCPN,
  liClass,
  ulClass,
  linkClass,
  horizontal,
  activeItem,
}: Props<T>) {
  const router = useRouter();

  function LinkCPN(props: T) {
    const [path, setPath] = useState(props.path);

    const onPathChange = (newPath: string) => {
      setPath(newPath);
    };

    return (
      <div
        className={linkClass}
        onClick={(e) => {
          e.preventDefault();
          router.push(path);
        }}
      >
        <ItemCPN {...props} onPathChange={onPathChange} />
      </div>
    );
  }

  return (
    <List
      items={items}
      activeItem={activeItem}
      ItemCPN={LinkCPN}
      liClass={liClass}
      ulClass={ulClass}
      horizontal={horizontal}
    />
  );
}
