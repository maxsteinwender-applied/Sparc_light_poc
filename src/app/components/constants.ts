import { PiggyBank, Home, Globe, UserPlus, Palmtree } from 'lucide-react';
import { GoalType } from './WizardContext';

export const GOALS: { id: GoalType; label: string; icon: any; image: string }[] = [
  { 
    id: 'Notgroschen', 
    label: 'Notgroschen', 
    icon: PiggyBank,
    image: "https://images.unsplash.com/photo-1769676391614-ee47569b1c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWdneSUyMGJhbmslMjBjb2lucyUyMHNhdmluZ3N8ZW58MXx8fHwxNzcwMDM2MDI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: 'Eigenheim', 
    label: 'Eigenheim', 
    icon: Home,
    image: "https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MDAwMTQyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: 'Weltreise', 
    label: 'Weltreise', 
    icon: Globe,
    image: "https://images.unsplash.com/photo-1649522864970-668297e255f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMHRyYXZlbCUyMGdsb2JlJTIwbWFwfGVufDF8fHx8MTc3MDAzNjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: 'Altersvorsorge', 
    label: 'Altersvorsorge', 
    icon: UserPlus,
    image: "https://images.unsplash.com/photo-1764816633859-136c97741472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGVsZGVybHklMjBjb3VwbGUlMjByZWxheGluZyUyMGJlYWNofGVufDF8fHx8MTc3MDAzNjAyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  { 
    id: 'Sabbatical', 
    label: 'Sabbatical', 
    icon: Palmtree,
    image: "https://images.unsplash.com/photo-1597434429739-2574d7e06807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBjb3VwbGUlMjBtb3VudGFpbiUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzAwMzYwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
];
