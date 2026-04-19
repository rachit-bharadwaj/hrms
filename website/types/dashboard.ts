export interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  progress?: {
    current: number;
    total: number;
    color?: string;
  };
}
