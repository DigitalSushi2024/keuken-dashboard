import * as signalR from "@microsoft/signalr";

// Maak een SignalR-verbinding
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7110/orderHub") // Zorg dat deze URL klopt met je backend
    .withAutomaticReconnect() // Automatisch opnieuw verbinden bij een verbroken verbinding
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Start de verbinding
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
        setTimeout(startSignalRConnection, 5000); // Probeer opnieuw te verbinden na 5 seconden
    }
};

// Functie om te luisteren naar "OrderCompleted" events
export const onOrderCompleted = (callback) => {
    connection.on("OrderCompleted", callback);
};

// Functie om te luisteren naar "NewOrder" events
export const onNewOrder = (callback) => {
    connection.on("NewOrder", callback);
};

export default connection;
