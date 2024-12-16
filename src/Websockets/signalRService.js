import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7110/orderHub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startSignalRConnection = async () => {
    if (connection.state !== signalR.HubConnectionState.Disconnected) {
        console.warn("SignalR connection is already active or reconnecting.");
        return;
    }

    try {
        await connection.start();
        console.log("SignalR Connected");
    } catch (error) {
        console.error("SignalR Connection Error:", error);
        setTimeout(startSignalRConnection, 5000);
    }
};

export const onOrderCompleted = (callback) => {
    connection.on("OrderCompleted", callback);
};

export const onNewOrder = (callback) => {
    connection.on("NewOrder", callback);
};

export default connection;
