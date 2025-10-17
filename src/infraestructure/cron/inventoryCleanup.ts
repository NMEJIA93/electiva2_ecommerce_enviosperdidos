import cron from "node-cron";
import { InventoryModel } from "../database/inventory-mongo";

cron.schedule("0 * * * *", async () => {    
    console.log('Cron running');
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const inventories = await InventoryModel.find({ 'reservations.createdAt': { $lt: cutoff } });

    for (const inv of inventories) {
        inv.reservations = inv.reservations.filter(r => r.createdAt >= cutoff);
        inv.reservedStock = inv.reservations.reduce((sum, r) => sum + r.quantity, 0);
        await inv.save();
    }
});

