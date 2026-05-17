export interface OrderNotification {
    orderId: number;
    orderNumber: string;
    message: string;
    placedAt: string;
    readyAt: string;
    cashierName?: string;
}
