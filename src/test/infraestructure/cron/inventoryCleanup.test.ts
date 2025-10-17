import cron from "node-cron";
import { InventoryModel } from "../../../infraestructure/database/inventory-mongo";

// Mock node-cron
jest.mock("node-cron");
const mockCron = cron as jest.Mocked<typeof cron>;

// Mock InventoryModel
jest.mock("../../../infraestructure/database/inventory-mongo");
const mockInventoryModel = InventoryModel as jest.Mocked<typeof InventoryModel>;

describe("Inventory Cleanup Cron Job", () => {
  let cronCallback: () => Promise<void>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    
    // Capture the cron callback
    mockCron.schedule.mockImplementation((schedule, callback) => {
      cronCallback = callback as () => Promise<void>;
      return {} as any;
    });
    
    // Import the cron job to register it
    require("../../../infraestructure/cron/inventoryCleanup");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should schedule cron job with correct pattern", () => {
    expect(mockCron.schedule).toHaveBeenCalledWith(
      "0 * * * *", 
      expect.any(Function)
    );
  });

  it("should clean up expired reservations", async () => {
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25 hours ago
    const validDate = new Date(now.getTime() - 23 * 60 * 60 * 1000); // 23 hours ago

    const mockInventory = {
      reservations: [
        { createdAt: expiredDate, quantity: 5 },
        { createdAt: validDate, quantity: 3 }
      ],
      reservedStock: 8,
      save: jest.fn()
    };

    mockInventoryModel.find.mockResolvedValue([mockInventory]);

    await cronCallback();

    expect(console.log).toHaveBeenCalledWith('Cron running');
    expect(mockInventoryModel.find).toHaveBeenCalledWith({
      'reservations.createdAt': { $lt: expect.any(Date) }
    });
    
    expect(mockInventory.reservations).toHaveLength(1);
    expect(mockInventory.reservations[0].quantity).toBe(3);
    expect(mockInventory.reservedStock).toBe(3);
    expect(mockInventory.save).toHaveBeenCalled();
  });

  it("should handle empty reservations", async () => {
    const mockInventory = {
      reservations: [],
      reservedStock: 0,
      save: jest.fn()
    };

    mockInventoryModel.find.mockResolvedValue([mockInventory]);

    await cronCallback();

    expect(mockInventory.reservations).toHaveLength(0);
    expect(mockInventory.reservedStock).toBe(0);
    expect(mockInventory.save).toHaveBeenCalled();
  });

  it("should handle multiple inventories", async () => {
    const mockInventories = [
      {
        reservations: [{ createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), quantity: 2 }],
        reservedStock: 2,
        save: jest.fn()
      },
      {
        reservations: [{ createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000), quantity: 4 }],
        reservedStock: 4,
        save: jest.fn()
      }
    ];

    mockInventoryModel.find.mockResolvedValue(mockInventories);

    await cronCallback();

    expect(mockInventories[0].reservations).toHaveLength(0);
    expect(mockInventories[0].reservedStock).toBe(0);
    expect(mockInventories[0].save).toHaveBeenCalled();

    expect(mockInventories[1].reservations).toHaveLength(1);
    expect(mockInventories[1].reservedStock).toBe(4);
    expect(mockInventories[1].save).toHaveBeenCalled();
  });
});