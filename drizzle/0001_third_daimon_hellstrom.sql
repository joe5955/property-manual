CREATE TABLE `map_pins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sheetId` int NOT NULL DEFAULT 1,
	`title` varchar(255) NOT NULL,
	`notes` text,
	`category` varchar(64) NOT NULL DEFAULT 'other',
	`positionX` float NOT NULL,
	`positionY` float NOT NULL,
	`photos` text,
	`manualSectionId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `map_pins_id` PRIMARY KEY(`id`)
);
