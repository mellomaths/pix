import { Console, Command } from 'nestjs-console';
import { getConnection } from "typeorm";
import fixtures from "./fixtures";
import * as chalk from 'chalk';

@Console()
export class FixturesCommand {

    @Command({
        command: 'fixtures',
        description: 'Seed data in database'
    })
    async command() {
        await this.runMigrations();
        for(const fixture of fixtures) {
            await this.createInDatabase(fixture.model, fixture.fields);
        }

        console.log(chalk.green('Data generated!'));
    }
    
    async runMigrations() {
        const connection = getConnection('default');
        for (const migration of connection.migrations.reverse()) {
            await connection.undoLastMigration();
        }
    }

    async createInDatabase(model: any, data: any) {
        const repository = this.getRepository(model);
        const entity = repository.create(data);
        await repository.save(entity);
    } 

    getRepository(model: any) {
        const connection = getConnection('default');
        return connection.getRepository(model);
    }
}