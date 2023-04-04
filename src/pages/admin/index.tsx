import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { adminConfig } from '@/config';

const AdminIndexPage = () => {
    const router = useRouter();

    const { sections } = adminConfig;
    
    const firstSectionSlug = sections[0].slug;
    const firstSectionUrl = `/admin/${firstSectionSlug}`;

    useEffect(() => {
        router.push(firstSectionUrl);
    }, []);

    return null;

};

export default AdminIndexPage;
