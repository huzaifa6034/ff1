
export interface User {
  id: string;
  name: string;
  email: string;
  ff_uid: string;
  whatsapp: string;
  avatar?: string;
}

export interface Tournament {
  id: string;
  title: string;
  dateTime: string;
  entryFee: string;
  prizePool: string;
  slots: number;
  registeredCount: number;
  status: 'open' | 'closed' | 'finished';
  whatsappLink?: string;
  rules?: string;
}

export interface Player {
  id: string;
  userId: string;
  tournamentId: string;
  registrationDate: string;
}

export interface AppState {
  view: 'home' | 'details' | 'rules' | 'results' | 'admin-login' | 'admin-dashboard' | 'register' | 'profile' | 'auth';
  selectedTournamentId?: string;
  user: User | null;
  isAdmin: boolean;
}
