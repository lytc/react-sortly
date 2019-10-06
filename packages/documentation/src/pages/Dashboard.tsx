import React from 'react';
import { Typography, Box } from '@material-ui/core';

const Dashboard = () => (
  <div>
    <Box fontSize={20} fontWeight={300} textAlign="center" mb={5}>
      React Sortly is a simple, lightweight and highly customizable dnd nested sortable React component.
      <br />
      Supported to sort the tree, vertical list, horizontal list, table row and maybe more!
    </Box>
    <Typography variant="h4">Installation</Typography>
    <Box p={2} bgcolor="grey.200" borderRadius={2} color="secondary.main">
      <Typography>npm install --save react-sortly react-dnd react-dnd-html5-backend</Typography>
    </Box>
  </div>
);

export default Dashboard;
