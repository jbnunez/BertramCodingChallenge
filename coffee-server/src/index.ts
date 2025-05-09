import express from "express"
import cors from "cors"
import fs from 'fs'
import { GroupOrder, GroupOrderPayment, User, UserOrder } from "./types"
import { getFutureUserBalances, splitTaxTip } from "./utils"

const usersFile = 'src/data/users.json'
const app = express()

app.use(express.json())
app.use(cors())

app.get("/api/users", async (req, res) => {
    var users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    res.json({ message: "Success", data: users })
})

app.post("/api/addUser", async (req, res) => {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    const user: User = req.body
    if (users.find((u: User) => u.email === user.email)) {
        throw new Error("A user with that email already exists")
    }
    users.push(user)

    fs.writeFile(usersFile, JSON.stringify(users), err => {
        if (err) {
            throw err;
        } else {
            res.json({ message: "Success" })
        }
    })
})

app.post("/api/getSuggestedPayer", async (req, res) => {
    console.log('body', req.body)
    const groupOrder: GroupOrder = req.body
    var users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    let lowestBalance = Number.MAX_VALUE
    let payer: User | null = null
    const userEmailsInOrder = groupOrder.userOrders.map(order => order.email)
    getFutureUserBalances(users, groupOrder).forEach((user: User) => {
        const userIndex = userEmailsInOrder.findIndex(email => email === user.email)
        if (userIndex >= 0 && user.balance < lowestBalance) {
            lowestBalance = user.balance
            payer = user
        }
    })
    res.json({ message: "Success", data: payer })
})

app.post("/api/payment", async (req, res) => {
    const groupOrderPayment: GroupOrderPayment = req.body
    const orderWithTaxTip = splitTaxTip(groupOrderPayment.groupOrder, groupOrderPayment.total)
    var users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    const updatedUsers = getFutureUserBalances(users, orderWithTaxTip)
    const payerIndex = updatedUsers.findIndex((u: User) => u.email === groupOrderPayment.payerEmail)
    if (payerIndex < 0) {
        throw new Error(`No user found with email ${groupOrderPayment.payerEmail}`)
    }
    updatedUsers[payerIndex].balance += groupOrderPayment.total

    fs.writeFile(usersFile, JSON.stringify(updatedUsers), err => {
        if (err) {
            throw err;
        } else {
            res.json({ message: "Success" })
        }
    });
})


app.listen(5000, () => {
    console.log("server running on localhost:5000")
})