import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { 
  CssBaseline, AppBar, Toolbar, SwipeableDrawer, List, ListSubheader, ListItem, ListItemText, Box
} from '@material-ui/core';
import { HashRouter as Router, Route, Link as RouterLink } from 'react-router-dom';

import routes from './routes';

const theme = createMuiTheme({

});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Box display="flex" pt={8} minHeight="100vh">
          <AppBar position="fixed">
            <Toolbar>x</Toolbar>
          </AppBar>
          <Box
            component="nav"
            aria-label="Main navigation"
            width={{ sm: 0, lg: 240 }}
          >
            <SwipeableDrawer 
              open 
              variant="permanent"
              onOpen={() => {}}
              onClose={() => {}}
            >
              <Box width={240}>
                {routes.map(({ id, label, children }) => (
                  <List key={id} subheader={<ListSubheader>{label}</ListSubheader>}>
                    {children.map((child) => (
                      <ListItem key={child.id} button component={RouterLink} to={`/${id}/${child.id}`}>
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                ))}
              </Box>
            </SwipeableDrawer>
          </Box>
          <Box flex={1} px={4} py={2}>
            {routes.map(({ id, children }) => (
              <React.Fragment key={id}>
                {children.map((child) => (
                  <Route key={child.id} path={`/${id}/${child.id}`} component={child.component} />
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Router>
    </DndProvider>
  </ThemeProvider>
);

export default App;
