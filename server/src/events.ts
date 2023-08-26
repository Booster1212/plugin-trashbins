import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { TrashbinEvents } from '@AthenaPlugins/trashbin-simulator/shared/enums';
import { trashItems } from './defaults/trashItems';

const lockedTrashbins = [];

const trashbinCooldown = 60000; // 1 minute

alt.onClient(TrashbinEvents.REQUEST_TRASH, (player, pos) => {
    const existingLock = lockedTrashbins.find((bin) => areVectorsEqual(bin.pos, pos));

    if (existingLock) {
        const elapsedTime = Date.now() - existingLock.lockTime;
        if (elapsedTime < trashbinCooldown) {
            const remainingCooldown = trashbinCooldown - elapsedTime;
            alt.logWarning(
                `Trashbin at ${pos.x}, ${pos.y}, ${pos.z} is currently locked. Remaining cooldown: ${remainingCooldown}ms`,
            );
            return;
        } else {
            const index = lockedTrashbins.indexOf(existingLock);
            if (index !== -1) {
                lockedTrashbins.splice(index, 1);
            }
        }
    }

    const droppedItems = generateDroppedItems();

    alt.log(`Opening trashbin at ${pos.x}, ${pos.y}, ${pos.z}`);
    alt.emitClient(player, TrashbinEvents.OPEN_TRASHBIN);
    Athena.webview.emit(player, TrashbinEvents.REQUEST_TRASH, droppedItems);

    lockedTrashbins.push({ pos, player, lockTime: Date.now() });
});

function areVectorsEqual(vec1: alt.Vector3, vec2: alt.Vector3) {
    return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
}

function generateDroppedItems() {
    return trashItems
        .filter((item) => Math.random() * 100 <= item.dropChance)
        .map((item) => ({
            ...item,
            amount: Math.floor(Math.random() * (item.amount + 1)),
            name: Athena.systems.inventory.factory.getBaseItem(item.dbName).name,
        }));
}

alt.onClient(
    TrashbinEvents.GRAB_TRASH,
    async (player: alt.Player, item: { dbName: string; dropChance: number; amount: number }, removeAmount: number) => {
        alt.logError(`Trying to remove ${item.dbName} from a trashbin. Dropchance is: ${item.dropChance}`);

        const baseItem = await Athena.systems.inventory.factory.getBaseItemAsync(item.dbName);
        if (!baseItem) return;

        const isAdded = await Athena.player.inventory.add(player, {
            dbName: baseItem.dbName,
            quantity: removeAmount,
            data: baseItem.data,
        });
        if (!isAdded) {
            alt.logWarning(`Couldn't add ${item.dbName} to Inventory. Inventory full?`);
        } else {
            alt.logWarning(`Success. Added: ${item.dbName} x${item.amount}!`);
        }
    },
);
