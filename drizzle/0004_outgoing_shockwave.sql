CREATE TABLE `map_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sheetId` int NOT NULL DEFAULT 1,
	`title` varchar(255) NOT NULL,
	`notes` text,
	`category` varchar(64) NOT NULL DEFAULT 'other',
	`color` varchar(16) NOT NULL DEFAULT '#f97316',
	`points` text NOT NULL,
	`photos` text,
	`manualSectionId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `map_routes_id` PRIMARY KEY(`id`)
);
