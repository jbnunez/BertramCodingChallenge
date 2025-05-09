import { useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { User, UserRowData } from './types'
import UserRow from './UserRow'
import { addPayment, getSuggestedPayer } from './api'

export function Orders() {
    const [rows, setRows] = useState<UserRowData[]>([])
    const [rowsExpanded, setRowsExpanded] = useState<boolean>(true)
    const [showReset, setShowReset] = useState<boolean>(false)
    const [payerRow, setPayerRow] = useState<UserRowData>({user: null, price: 0})
    const [payer, setPayer] = useState<User | null>(null)
    const [payerUserError, setPayerUserError] = useState<boolean>(false)
    const [payerPriceError, setPayerPriceError] = useState<boolean>(false)

    const handleReset = () => {
        setRows([])
        setRowsExpanded(true)
        setShowReset(false)
        setPayerRow({user: null, price: 0})
        setPayer(null)
        setPayerUserError(false)
        setPayerPriceError(false)
    }

    const handleRowChange = (index: number, rowData: UserRowData) => {
        const newRows = [...rows]
        newRows[index] = rowData
        setRows(newRows)
    }

    const handleWhoShouldPay = async () => {
        const groupOrder = {
            userOrders: rows.filter(
                (row: UserRowData) => row.user && row.price !== 0
            ).map((row: UserRowData) => ({
                email: row.user!.email,
                price: row.price
            }))
        }
        const payer = await getSuggestedPayer(groupOrder)
        if (payer) {
            setPayerRow({ user: payer, price: 0 })
            setPayer(payer!)
            setRowsExpanded(false)
        }
    }

    const isPayerValid = () => {
        let valid = true
        if (!payerRow.user) {
            setPayerUserError(true)
            valid = false
        }
        if (payerRow.price <= 0) {
            setPayerPriceError(true)
            valid = false
        }
        return valid
    }

    const handleSubmitPayment = async () => {
        setPayerUserError(false)
        setPayerPriceError(false)

        if (!isPayerValid()) {
            return
        }

        const groupOrder = {
            userOrders: rows.filter(
                (row: UserRowData) => row.user && row.price !== 0
            ).map((row: UserRowData) => ({
                email: row.user!.email,
                price: row.price
            }))
        }
        const payment = {
            groupOrder,
            payerEmail: payerRow.user!.email,
            total: payerRow.price
        }
        const response = await addPayment(payment)
        if (response.message === 'Success') {
            setShowReset(true)
        }
    }
    return (
        <div>
            <Box display='flex' flexDirection='column' alignItems='center' alignContent='center'>
            {rowsExpanded && (<div>
                <Box display='flex' flexDirection='column'>
                    {rows.map((row, index) => (
                        <UserRow
                            rowData={row}
                            setRow={(rowData: UserRowData) => handleRowChange(index, rowData)} 
                            userError={false}
                            priceError={false}
                        />
                    ))}
                </Box>
                <Button onClick={() => {setRows([...rows, {user: null, price: 0}])}}>Add Person to Order</Button>
                <Box display='flex' flexDirection='row' alignItems='center' alignContent='center'>
                    {rows.length > 1 && 
                        <Button color="secondary" onClick={handleWhoShouldPay}>
                            Who Should Pay?
                        </Button>}
                </Box>
            </div>)}
            {payer && rowsExpanded && (<IconButton onClick={() => setRowsExpanded(false)}><ExpandLessIcon /></IconButton>)}
            {payer && !rowsExpanded && (<IconButton onClick={() => setRowsExpanded(true)}><ExpandMoreIcon /></IconButton>)}
            {payer && <Box>
                <Typography variant='h4'>{payer.firstName} {payer.lastName} pays this time</Typography>
            </Box>}
            {payer && <Box>
                <Typography variant='h6'>Enter payment info</Typography>
                <Typography variant='body1'>You may choose a different person to pay if you wish.</Typography>
                <Typography variant='body2'>Be sure to include the tax and tip in the amount so it gets evenly divided amongst everyone.</Typography>
                <UserRow
                    rowData={payerRow}
                    setRow={(rowData: UserRowData) => setPayerRow(rowData)} 
                    userError={payerUserError}
                    priceError={payerPriceError}
                />
                <Button onClick={handleSubmitPayment}>
                   Submit Payment
                </Button>
            </Box>}
            {showReset && <Box>
                <Button color='secondary' onClick={handleReset}>
                   Reset
                </Button>
            </Box>}
            </Box>
        </div>
    )
}

export default Orders