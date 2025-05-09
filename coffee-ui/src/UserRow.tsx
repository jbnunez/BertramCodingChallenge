import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { User, UserRowData } from './types';
import { useContext } from 'react';
import { UsersContext } from './App';

export function UserRow(props: {
    rowData: UserRowData,
    setRow: (data: UserRowData) => void,
    userError: boolean,
    priceError: boolean,
}) {
    const { users } = useContext(UsersContext)
    const { rowData, setRow, userError, priceError } = props
    return (
        <Box display='flex' flexDirection='row' m={3}>
            <Box mr={3}>
                <FormControl>
                    <InputLabel>User</InputLabel>
                    <Select
                        label="User" 
                        value={props.rowData.user?.email}
                        sx={{
                            width: '300px'
                        }}
                        onChange={(e) => {
                            setRow({
                                user: users.find(u => u.email === e.target.value)!,
                                price: rowData.price
                            })
                        }}
                        error={userError}
                    >
                        {users.map((user: User) => (<MenuItem value={user.email}>{user.firstName} {user.lastName}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <TextField 
                    label="Amount" 
                    type='number' 
                    onChange={(e) => setRow({ user: rowData.user, price: parseFloat(e.target.value) })}
                    value={rowData.price}
                    error={priceError}
                />
            </Box>
            
        </Box>
    )
}

export default UserRow