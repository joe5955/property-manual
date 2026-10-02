CREATE TABLE `property_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`location` varchar(160) NOT NULL DEFAULT 'Property-wide',
	`description` text,
	`status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
	`suggestions` text,
	`sourceNote` text,
	`completedAt` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `property_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `task_time_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`workedAt` bigint NOT NULL,
	`minutes` int NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_time_entries_id` PRIMARY KEY(`id`)
);
