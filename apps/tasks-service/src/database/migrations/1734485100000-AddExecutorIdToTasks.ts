import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExecutorIdToTasks1734485100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'executorId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add index for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_executorId" ON "tasks" ("executorId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_tasks_executorId"`);
    await queryRunner.dropColumn('tasks', 'executorId');
  }
}
