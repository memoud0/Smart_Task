import {auth} from '@/app/auth'
import { redirect } from 'next/navigation';

export default async function Page() {
    const session = await auth();

    if (session) redirect('/Calendar')

    else redirect('/login');
}