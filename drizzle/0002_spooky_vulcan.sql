CREATE TABLE `refresh_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(96) NOT NULL,
	`sourceUrl` text NOT NULL,
	`sourcePeriod` varchar(32) NOT NULL,
	`status` enum('success','skipped','failed') NOT NULL,
	`recordCount` int NOT NULL DEFAULT 0,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_runs_id` PRIMARY KEY(`id`)
);
