import { GroupOrder, User, UserOrder } from "./types";

export function getFutureUserBalances(users: User[], groupOrder: GroupOrder) {
    const updatedUsers = [...users]
    groupOrder.userOrders.forEach((order: UserOrder) => {
        const index = updatedUsers.findIndex((u: User) => u.email === order.email)
        if (index < 0) {
            throw new Error(`Could not find user with email ${order.email}`)
        }
        updatedUsers[index].balance -= order.price
    })
    return updatedUsers
}

export function splitTaxTip(groupOrder: GroupOrder, total: number) {
    let preTaxTipTotal = 0
    groupOrder.userOrders.forEach((order: UserOrder) => {
        preTaxTipTotal += order.price
    })

    const order: GroupOrder = { userOrders: groupOrder.userOrders.map((order: UserOrder) => {
        return {
            email: order.email,
            price: order.price * total / preTaxTipTotal
        }
    }) }
    return order
}