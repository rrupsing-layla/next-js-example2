'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
}

interface NewPlayer {
  first_name: string;
  last_name: string;
  email: string;
}

export default function TeamDetails({ id }: { id: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [newPlayer, setNewPlayer] = useState<NewPlayer>({
    first_name: '',
    last_name: '',
    email: '',
  });
  const { toast } = useToast();
  const router = useRouter();

  const fetchTeamAndPlayers = async () => {
    try {
      // Fetch team and players in parallel for better performance
      const [teamResponse, playersResponse] = await Promise.all([
        supabase
          .from('teams')
          .select('id, name')
          .eq('id', id)
          .single(),
        supabase
          .from('players')
          .select('id, first_name, last_name, email')
          .eq('team_id', id)
      ]);

      if (teamResponse.error) throw teamResponse.error;
      if (playersResponse.error) throw playersResponse.error;

      setTeam(teamResponse.data);
      setPlayers(playersResponse.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load team details',
        variant: 'destructive',
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamAndPlayers();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([
          {
            ...newPlayer,
            team_id: id,
          },
        ])
        .select('id, first_name, last_name, email')
        .single();

      if (error) throw error;

      // Update local state instead of refetching
      setPlayers(prev => [...prev, data]);
      setNewPlayer({ first_name: '', last_name: '', email: '' });
      setIsDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Player added successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add player',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-lg text-muted-foreground">Team not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/teams')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Players</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Player
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Player</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPlayer} className="space-y-4">
                    <div>
                      <Input
                        placeholder="First Name"
                        name="first_name"
                        value={newPlayer.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Last Name"
                        name="last_name"
                        value={newPlayer.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={newPlayer.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Player
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {players.length === 0 ? (
              <p className="text-muted-foreground">No players added yet.</p>
            ) : (
              <div className="grid gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {player.first_name} {player.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{player.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}