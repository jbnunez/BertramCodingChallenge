import { GroupOrder, GroupOrderPayment, User } from "./types"

const BASE_API_URL = "http://localhost:5000/api"

export async function getUsers() {
    try {
        const response = await fetch(`${BASE_API_URL}/users`)
        const users: User[] = (await response.json()).data
        console.log('users', users)
        return users
    } catch (e) {
        console.log(e)
    }
}

export async function addUser(user: User) {
    try {
        const response = await fetch(`${BASE_API_URL}/addUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

export async function getSuggestedPayer(order: GroupOrder) {
    try {
        const response = await fetch(`${BASE_API_URL}/getSuggestedPayer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        const payer: User = (await response.json()).data
        return payer
    } catch (e) {
        console.log(e)
    }
}

export async function addPayment(payment: GroupOrderPayment) {
    try {
        const response = await fetch(`${BASE_API_URL}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payment)
        })
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

