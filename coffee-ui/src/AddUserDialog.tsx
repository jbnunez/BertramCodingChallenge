import { Box, Button, Dialog, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState } from "react";
import { User } from "./types";
import { UsersContext } from "./App";
import { addUser } from "./api";

export function AddUserDialog(props: { open: boolean, onClose: () => void }) {
    const { users, setUsers } = useContext(UsersContext)
    const { open, onClose } = props
    const [firstName, setFirstName] = useState('')
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastName, setLastName] = useState('')
    const [lastNameValid, setLastNameValid] = useState(true)
    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(true)

    const validateEmail = (email: string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      } 

    const validateFields = () => {
        let valid = true
        if (!firstName) {
            setFirstNameValid(false)
            valid = false
        }
        if (!lastName) {
            setLastNameValid(false)
            valid = false
        }
        if (!validateEmail(email)) {
            setEmailValid(false)
            valid = false
        }
        return valid
    }

    const handleSubmit = async () => {
        if (!validateFields()) {
            return
        }
        const newUser = {
            firstName,
            lastName,
            email,
            balance: 0
        }
        await addUser(newUser)
        setUsers([...users, newUser])
        onClose()
    }
    return (
    <Dialog open={open} onClose={onClose}>
        <Box>
            <Box display='flex' flexDirection='row-reverse' p={3}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box alignContent='center' display='flex' flexDirection='row' p={3}>
                <Typography variant='h4'>Add New User</Typography>
            </Box>
            <Box p={3}>
                <TextField
                    label="First name"
                    type="search"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!firstNameValid}
                    sx={{
                        width: '300px'
                    }}
                />
            </Box>
            <Box p={3}>
                <TextField
                    label="Last name"
                    type="search"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!lastNameValid}
                    sx={{
                        width: '300px'
                    }}
                />
            </Box>
            <Box p={3}>
                <TextField
                    label="Email Address"
                    type="search"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!emailValid}
                    sx={{
                        width: '300px'
                    }}
                />
            </Box>
            <Box display='flex' flexDirection='row-reverse' p={3}>
                <Button onClick={handleSubmit}>
                    Add User
                </Button>
            </Box>
        </Box>
    </Dialog>
    )
}

export default AddUserDialog