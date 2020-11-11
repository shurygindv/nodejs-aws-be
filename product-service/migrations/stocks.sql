CREATE TABLE IF NOT EXISTS stocks (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	"productId" uuid,
	"count" bigint,
	FOREIGN KEY ("productId") REFERENCES "products" ("id")
);

SELECT ("id", "productId", "count") FROM stocks