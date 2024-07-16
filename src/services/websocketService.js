// websocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client;

export function connect() {
  console.log('connectconnectconnect, WebSocket!');
    client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:1157/ws'),
        onConnect: () => {
            console.log('Connected');
            client.subscribe('/topic/notice', (message) => {
                showMessage(JSON.parse(message.body));
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    client.activate();
}

export function sendMessage(message) {
  console.log('sendMessage');
    if (client && client.connected) {
        client.publish({
            destination: '/app/sendToAll',
            body: JSON.stringify({ message })
        });
    }
}

function showMessage(message) {
    console.log('Received: ', message);
}
