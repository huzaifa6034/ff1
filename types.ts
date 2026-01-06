
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
  tournamentId: string;
  ign: string;
  uid: string;
  whatsapp: string;
  registrationDate: string;
}

export interface AppState {
  view: 'home' | 'details' | 'rules' | 'results' | 'admin-login' | 'admin-dashboard' | 'register';
  selectedTournamentId?: string;
  isAdmin: boolean;
}
