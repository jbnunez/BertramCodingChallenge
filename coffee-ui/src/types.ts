export interface User {
    firstName: string
    lastName: string
    email: string
    balance: number
}

export interface UserRowData {
    user: User | null
    price: number
}

export interface UserOrder {
    email: string
    price: number
}

export interface GroupOrder {
    userOrders: UserOrder[]
}

export interface GroupOrderPayment {
    groupOrder: GroupOrder
    total: number
    payerEmail: string
}