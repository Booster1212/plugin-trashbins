import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';

import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { TrashbinEvents } from '@AthenaPlugins/trashbin-simulator/shared/enums';

function init() {
    const page = new AthenaClient.webview.Page({
        name: 'Trashbin',
        callbacks: {
            onReady: async () => {},
            onClose: () => {},
        },
        options: {
            onOpen: {
                focus: true,
                hideHud: true,
                hideOverlays: true,
                setIsMenuOpenToTrue: true,
                showCursor: true,
                disableControls: 'all',
                disablePauseMenu: true,
            },
            onClose: {
                hideCursor: true,
                showHud: true,
                showOverlays: true,
                unfocus: true,
                setIsMenuOpenToFalse: true,
                enableControls: true,
                enablePauseMenu: true,
            },
        },
    });

    alt.onServer(TrashbinEvents.OPEN_TRASHBIN, () => {
        if (typeof page !== 'undefined') {
            page.open();
        }
    });
}

onTicksStart.add(init);
