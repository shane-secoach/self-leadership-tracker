CREATE TABLE `dailyCheckIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`moodScore` int NOT NULL,
	`energyScore` int NOT NULL,
	`stressScore` int NOT NULL,
	`pillarSelfAwareness` int NOT NULL,
	`pillarMindset` int NOT NULL,
	`pillarAction` int NOT NULL,
	`pillarImpact` int NOT NULL,
	`keyWin` varchar(200),
	`biggestChallenge` varchar(200),
	`penMoment` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyCheckIns_id` PRIMARY KEY(`id`)
);
