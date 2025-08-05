const z = require('zod');

const historyEntrySchema = z.object({
  time: z.number(),
  buyPrice: z.number(),
  sellPrice: z.number().optional(),
});

const productSchema = z
  .object({
    quick_status: z
      .object({
        buyPrice: z.number(),
        sellPrice: z.number(),
      })
      .passthrough(),
  })
  .passthrough();

const bazaarItemSchema = z.object({
  history: z.array(historyEntrySchema),
  product: productSchema.optional(),
});

const itemIdParamSchema = z.string().regex(/^[A-Z0-9_]+$/);

const timeframeSchema = z.enum(['1m', '1h', '1d', '1mo', '1w']);

module.exports = {
  historyEntrySchema,
  productSchema,
  bazaarItemSchema,
  itemIdParamSchema,
  timeframeSchema,
};
