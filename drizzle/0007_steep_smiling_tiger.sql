CREATE TABLE `work_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(160) NOT NULL,
	`sortDate` varchar(10) NOT NULL,
	`dateLabel` varchar(128) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(64) NOT NULL DEFAULT 'other',
	`location` varchar(160) NOT NULL DEFAULT 'Property-wide',
	`sourceImageUrl` text,
	`sourceImageFilename` varchar(512),
	`sourceText` text,
	`needsReview` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `work_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `work_records_source_key_unique` UNIQUE(`sourceKey`)
);
