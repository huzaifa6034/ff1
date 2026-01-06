
export interface User {
  id: string;
  name: string;
  email: string;
  ff_uid: string;
  whatsapp: string;
}

export interface Admin {
  id: string;
  username: string;
}

// Added Player interface which was missing
export interface Player {
  id: string;
  userId: string;
  tournamentId: string;
  registrationDate: string;
  ign?: string;
  uid?: string;
  whatsapp?: string;
}

export interface Tournament {
  id: string;
  title: string;
  mode: string;
  // Updated to camelCase to match component usage and fix errors
  entryFee: string;
  prizePool: string;
  dateTime: string;
  slots: number;
  registeredCount: number;
  status: 'open' | 'closed' | 'finished';
  room_id?: string;
  room_pass?: string;
  rules?: string;
  whatsappLink?: string;
}

export interface AppState {
  // Added 'register' and 'profile' to supported views
  view: 'home' | 'details' | 'auth' | 'dashboard' | 'admin-login' | 'admin-panel' | 'rules' | 'results' | 'register' | 'profile';
  authMode: 'login' | 'signup';
  user: User | null;
  admin: Admin | null;
  selectedTournamentId?: string;
}
