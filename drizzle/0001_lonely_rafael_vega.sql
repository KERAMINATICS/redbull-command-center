CREATE TABLE `dashboard_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`entityType` varchar(32) NOT NULL,
	`entityKey` varchar(128) NOT NULL,
	`action` enum('update') NOT NULL,
	`beforeJson` text NOT NULL,
	`afterJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dashboard_audit_logs_id` PRIMARY KEY(`id`)
);
