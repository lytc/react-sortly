import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/indigo';
import { 
  CssBaseline, AppBar, Toolbar, SwipeableDrawer, List, ListSubheader, 
  ListItem, ListItemText, Box, Typography, Divider, IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { HashRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom';

import { ContextProvider } from '../src';
import routes from './routes';
import useScreenSize from './hooks/useScreenSize';
import Dashboard from './pages/Dashboard';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const App = () => {
  const { isLargeScreen } = useScreenSize();
  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <ContextProvider>
          <Router>
            <Box display="flex" pt={8} minHeight="100vh">
              <AppBar position="fixed">
                <Toolbar>
                  <Box>
                    <Box>
                      <IconButton 
                        color="inherit" 
                        edge="start" 
                        aria-label="Toggle navigation"
                        onClick={() => setOpen(!open)}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Toolbar>
              </AppBar>
              <Box
                component="nav"
                aria-label="Main navigation"
                width={{ sm: 0, md: 240 }}
              >
                <SwipeableDrawer
                  open={isLargeScreen ? true : open}
                  variant={isLargeScreen ? 'permanent' : 'temporary'}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                >
                  <Box width={240}>
                    {routes.map(({ id, label, children }) => (
                      <List key={id} subheader={<ListSubheader>{label}</ListSubheader>}>
                        {children.map((child) => (
                          <ListItem 
                            key={child.id} 
                            button 
                            component={RouterLink} 
                            to={`/${id}/${child.id}`}
                            onClick={() => setOpen(false)}
                          >
                            <ListItemText primary={child.label} />
                          </ListItem>
                        ))}
                      </List>
                    ))}
                  </Box>
                </SwipeableDrawer>
              </Box>
              <Box flex={1} px={{ xs: 2, md: 4 }} py={2}>
                <Route path="/" exact component={Dashboard} />
                {routes.map(({ id, children }) => (
                  <React.Fragment key={id}>
                    {children.map((child) => (
                      <Route
                        key={child.id}
                        path={`/${id}/${child.id}`}
                        exact
                        component={(props: any) => {
                          // setOpen(false);
                          const Page = child.component;
                          return (
                            <>
                              <Typography variant="h4" component="h1" gutterBottom>{child.label}</Typography>
                              <Divider />
                              <Box mt={4}>
                                <Page {...props} />
                              </Box>
                            </>
                          );
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Router>
        </ContextProvider>
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;
