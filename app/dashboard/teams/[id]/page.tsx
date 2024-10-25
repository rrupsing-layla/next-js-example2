import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TeamDetails from '@/components/TeamDetails';

export default function TeamPage({ params }: { params: { id: string } }) {
  return <TeamDetails id={params.id} />;
}

export async function generateStaticParams() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: teams, error } = await supabase.from('teams').select('id');

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    if (!teams || teams.length === 0) {
      console.warn('No teams found');
      return [];
    }

    console.log('Teams found:', teams);

    return teams.map(({ id }) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}