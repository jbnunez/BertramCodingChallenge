import { useState, createContext, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Header from './Header';
import Orders from './Orders';
import { Box, Button } from '@mui/material';
import AddUserDialog from './AddUserDialog';
import { User } from './types';
import { getUsers } from './api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

type UsersContextType = {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>> 
}

export const UsersContext = createContext<UsersContextType>(
  null as unknown as UsersContextType,
);




function App() {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const setNewUsers = async () => {
      const newUsers = await getUsers()
      setUsers(newUsers || [])
    }
    setNewUsers()
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UsersContext.Provider value={{users, setUsers}}>
        <Box display='flex' flexDirection='row-reverse' width='100%' p={3}>
          <Button onClick={() => setOpen(true)}>Add New User</Button>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Header />
          <Orders />
        </Box>
        {open && <AddUserDialog open={open} onClose={() => setOpen(false)} />}
      </UsersContext.Provider>
    </ThemeProvider>
  );
}

export default App;
