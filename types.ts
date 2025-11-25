export enum StarStage {
  MAIN_SEQUENCE = 'MAIN_SEQUENCE',
  RED_SUPERGIANT = 'RED_SUPERGIANT',
  SUPERNOVA = 'SUPERNOVA',
  NEUTRON_STAR = 'NEUTRON_STAR'
}

export interface StageInfo {
  id: StarStage;
  title: string;
  description: string;
  details: string;
  color: string;
  cameraDist: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
