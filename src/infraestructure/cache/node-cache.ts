import NodeCache from "node-cache";

const TTL_SECONDS = 0;
const CHECK_PERIOD_SECONDS = 0;

const cache = new NodeCache ({
    stdTTL: TTL_SECONDS,
    checkperiod: CHECK_PERIOD_SECONDS,
    useClones: false
})

export default cache;