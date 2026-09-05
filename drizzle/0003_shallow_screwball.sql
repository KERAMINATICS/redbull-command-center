CREATE TABLE `decision_register` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetKey` varchar(128) NOT NULL,
	`owner` varchar(128) NOT NULL,
	`status` enum('open','in_review','approved','blocked','closed') NOT NULL DEFAULT 'open',
	`deadline` timestamp NOT NULL,
	`approvalOutcome` enum('pending','renew','renegotiate','test','exit') NOT NULL DEFAULT 'pending',
	`evidenceStatus` enum('missing','partial','ready') NOT NULL DEFAULT 'missing',
	`rationale` text NOT NULL,
	`nextAction` text NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `decision_register_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_observations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`market` varchar(96) NOT NULL,
	`periodKey` varchar(32) NOT NULL,
	`periodStage` enum('pre','post') NOT NULL,
	`groupType` enum('treatment','control') NOT NULL,
	`outcomeValue` decimal(14,4) NOT NULL,
	`sampleSize` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `market_observations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsorship_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceType` enum('exposure','crm','qr','retail') NOT NULL,
	`externalId` varchar(128) NOT NULL,
	`assetKey` varchar(128) NOT NULL,
	`market` varchar(96),
	`eventDate` timestamp NOT NULL,
	`metric` varchar(96) NOT NULL,
	`metricValue` decimal(14,4) NOT NULL,
	`consented` enum('yes','no','not_applicable') NOT NULL DEFAULT 'not_applicable',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sponsorship_evidence_id` PRIMARY KEY(`id`)
);
