import baseTheme from '@famjam/tokens/base';
import {
  Icon,
  IconName,
  Grid,
  Button,
  ButtonVariant,
  ThemeProvider,
} from '@famjam/ui';

function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <Grid>
        <Button variant={ButtonVariant.Ghost}>
          <Icon name={IconName.Account} size={18} />
        </Button>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
