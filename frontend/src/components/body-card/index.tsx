import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Mock Dat

export default function BodyCard({ children }: { children: React.ReactNode }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ borderRadius: '1px' }}>{children}</Card>
      </Grid>
    </Grid>
  );
}
