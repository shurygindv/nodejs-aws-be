-- todo: typeorm
CREATE TABLE IF NOT EXISTS products (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	"title" varchar(100) NOT NULL,
	"description" varchar(200),
	"imageName" varchar(50),
	"price" bigint
);

INSERT INTO products ("title", "description", "price", "imageName") VALUES ('t1', 'd1 more', 112, 'mmm1.jpg');
INSERT INTO products ("title", "description", "price", "imageName") VALUES ('t2', 'd2 more', 177, 'mmm2.jpg');
INSERT INTO products ("title", "description", "price", "imageName") VALUES ('t3', 'd3 more', 222, 'moscow1.jpg');
SELECT ("title", "description", "price") FROM products