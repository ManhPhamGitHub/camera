import { MigrationInterface, QueryRunner } from "typeorm";

export class initDb1717085484808 implements MigrationInterface {
    name = 'initDb1717085484808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cam\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`ipAddress\` varchar(255) NOT NULL, \`startTime\` varchar(255) NOT NULL, \`endTime\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cam_noti\` (\`id\` varchar(36) NOT NULL, \`idCam\` varchar(255) NOT NULL, \`idNoti\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cam_config\` (\`id\` varchar(36) NOT NULL, \`idCam\` varchar(255) NOT NULL, \`input\` varchar(255) NOT NULL, \`output\` varchar(255) NOT NULL, \`idStorage\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`noti\` (\`id\` varchar(36) NOT NULL, \`channel\` varchar(255) NOT NULL, \`config\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`provider\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`identify\` json NOT NULL, \`fileDirection\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`storage\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`idCam\` varchar(255) NOT NULL, \`idProvider\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`storage\``);
        await queryRunner.query(`DROP TABLE \`provider\``);
        await queryRunner.query(`DROP TABLE \`noti\``);
        await queryRunner.query(`DROP TABLE \`cam_config\``);
        await queryRunner.query(`DROP TABLE \`cam_noti\``);
        await queryRunner.query(`DROP TABLE \`cam\``);
    }

}
