import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import './src/events';

const PLUGIN_NAME = 'trashbin-simulator';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    alt.log('Hello World!');
});
