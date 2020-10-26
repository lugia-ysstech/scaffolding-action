const pluginInfo = require('../src/plugins/pluginInfos.json');
const externals = require("./externals");
const compile = require('@lugia/devtools-widgets/lib/compilePlugin');

compile(pluginInfo, externals, 'index.js');
