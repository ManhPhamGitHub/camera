import { MigrationInterface, QueryRunner } from "typeorm";

export class init1718188057896 implements MigrationInterface {
    name = 'init1718188057896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`storage\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`idCamConfig\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`provider\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`providerName\` varchar(255) NOT NULL DEFAULT 1, \`identify\` text NOT NULL, \`config\` json NULL, \`fileDirection\` varchar(255) NULL, \`idCamConfig\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_7ea21727d5eebb003243f41274\` (\`idCamConfig\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cam_config\` (\`id\` varchar(36) NOT NULL, \`idCam\` varchar(255) NOT NULL, \`input\` varchar(255) NOT NULL, \`output\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_e4d519229f725e317accec40ca\` (\`idCam\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`noti\` (\`id\` varchar(36) NOT NULL, \`channel\` varchar(255) NOT NULL, \`config\` json NOT NULL, \`idCam\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cam\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`ipAddress\` varchar(255) NOT NULL, \`startTime\` varchar(255) NOT NULL, \`endTime\` varchar(255) NULL, \`description\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`storage\` ADD CONSTRAINT \`FK_1005aca63ed0f25b0011ec95c35\` FOREIGN KEY (\`idCamConfig\`) REFERENCES \`cam_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`provider\` ADD CONSTRAINT \`FK_7ea21727d5eebb003243f41274b\` FOREIGN KEY (\`idCamConfig\`) REFERENCES \`cam_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cam_config\` ADD CONSTRAINT \`FK_e4d519229f725e317accec40cab\` FOREIGN KEY (\`idCam\`) REFERENCES \`cam\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`noti\` ADD CONSTRAINT \`FK_3c150e3992d307373e0b298dfa2\` FOREIGN KEY (\`idCam\`) REFERENCES \`cam\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`noti\` DROP FOREIGN KEY \`FK_3c150e3992d307373e0b298dfa2\``);
        await queryRunner.query(`ALTER TABLE \`cam_config\` DROP FOREIGN KEY \`FK_e4d519229f725e317accec40cab\``);
        await queryRunner.query(`ALTER TABLE \`provider\` DROP FOREIGN KEY \`FK_7ea21727d5eebb003243f41274b\``);
        await queryRunner.query(`ALTER TABLE \`storage\` DROP FOREIGN KEY \`FK_1005aca63ed0f25b0011ec95c35\``);
        await queryRunner.query(`DROP TABLE \`cam\``);
        await queryRunner.query(`DROP TABLE \`noti\``);
        await queryRunner.query(`DROP INDEX \`REL_e4d519229f725e317accec40ca\` ON \`cam_config\``);
        await queryRunner.query(`DROP TABLE \`cam_config\``);
        await queryRunner.query(`DROP INDEX \`REL_7ea21727d5eebb003243f41274\` ON \`provider\``);
        await queryRunner.query(`DROP TABLE \`provider\``);
        await queryRunner.query(`DROP TABLE \`storage\``);
    }

}
