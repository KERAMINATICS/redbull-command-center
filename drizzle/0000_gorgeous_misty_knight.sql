CREATE TABLE `activation_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`attendance` int NOT NULL,
	`leads` int NOT NULL,
	`conversions` int NOT NULL,
	`roiPct` decimal(8,2) NOT NULL,
	`spendM` decimal(10,2) NOT NULL,
	`dataStatus` enum('simulated','public_proxy','observed') NOT NULL DEFAULT 'simulated',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activation_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `activation_metrics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `channel_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel` varchar(64) NOT NULL,
	`revenueM` decimal(12,2) NOT NULL,
	`profitM` decimal(12,2) NOT NULL,
	`growthPct` decimal(8,2) NOT NULL,
	`marginPct` decimal(8,2) NOT NULL,
	`cac` decimal(10,2) NOT NULL,
	`repeatPct` decimal(8,2) NOT NULL,
	`newRatePct` decimal(8,2) NOT NULL,
	`roiPct` decimal(8,2) NOT NULL,
	`color` varchar(16) NOT NULL,
	`dataStatus` enum('simulated','public_proxy','observed') NOT NULL DEFAULT 'simulated',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `channel_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `channel_metrics_channel_unique` UNIQUE(`channel`)
);
--> statement-breakpoint
CREATE TABLE `dashboard_assumptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assumptionKey` varchar(96) NOT NULL,
	`assumptionValue` text NOT NULL,
	`sourceType` enum('public_context','public_proxy','simulated_model','decision_rule') NOT NULL,
	`explanation` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dashboard_assumptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `dashboard_assumptions_assumptionKey_unique` UNIQUE(`assumptionKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
