import { NextRouter } from 'next/router';

export default function changeURL(query:any, router:NextRouter) {
    

    router.push(
        {
        pathname: router.pathname,
        query: {
            ...router.query,
            ...query,
        },
        },
        undefined,
        { shallow: true },
    );
}