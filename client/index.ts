import * as alt from 'alt-client';
import * as native from 'natives';

import { trashProps } from '../shared/props';
import { TrashbinEvents } from '../shared/enums';
import { allBins } from '../shared/worldBinsDumpsters';

import './src/view';

const player = alt.Player.local;
alt.on('keyup', (key) => {
    if (key === 'E'.charCodeAt(0)) {
        if (alt.Player.local.vehicle) return;

        for (const prop of trashProps) {
            const object = native.getClosestObjectOfType(
                player.pos.x,
                player.pos.y,
                player.pos.z,
                2,
                alt.hash(prop),
                false,
                false,
                false,
            );

            const pos = native.getEntityCoords(object, false);
            if (object && pos) {
                native.freezeEntityPosition(object, true);
                alt.emitServer(TrashbinEvents.REQUEST_TRASH, pos);
                console.log(`Player is at trashbin.`);
                return;
            }
        }
    }
});
