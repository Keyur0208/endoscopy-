import Card from '@mui/material/Card';

// Mock Dat

export default function InfoTable({ children }: { children: React.ReactNode }) {
  return <Card sx={{ borderRadius: '1px' }}>{children}</Card>;
}
