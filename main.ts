const deadPing = 20000;
const lostPing = 10000;
interface Client {  
    id: number;
    sprite: game.LedSprite;
    ping: number;
}
const clients: Client[] = [];

function getClient(id: number): Client {
    if (!id)
        return undefined;
    for (const client of clients)
        if (client.id == id)
            return client;
    const n = clients.length;
    if (n == 24) 
        return undefined;
    const client: Client = {
        id: id,
        sprite: game.createSprite(n % 5, n / 5),
        ping: input.runningTime()
    }
    clients.push(client);
    return client;
}
radio.onReceivedNumber(function (receivedNumber) {
    const serialNumber = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    const client = getClient(serialNumber);
    if (!client)
        return;

    client.ping = input.runningTime()
    client.sprite.setBrightness(Math.max(1, receivedNumber & 0xff));
})
basic.forever(() => {
    const now = input.runningTime()
    for (const client of clients) {
        const lastPing = now - client.ping;
        if (lastPing > deadPing) {
            client.sprite.setBlink(0)
            client.sprite.setBrightness(0)
        }
        else if (lastPing > lostPing)
            client.sprite.setBlink(500);
        else
            client.sprite.setBlink(0);
    }
    basic.pause(500)
})
radio.setGroup(4)
game.addScore(1)
