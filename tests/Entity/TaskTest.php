<?php

namespace App\Tests\Entity;

use App\Entity\Task;
use PHPUnit\Framework\TestCase;

class TaskTest extends TestCase
{
    const VALID_TASK_NAME = 'Test the entity Task';

    const VALID_TASK_DUE_DATE = '2023-06-22T14:00:00';

    const VALID_TASK_DESCRIPTION = 'Write tests for the entity Task';

    public function testTaskCreation(): void
    {
        $task = new Task(self::VALID_TASK_NAME, self::VALID_TASK_DUE_DATE, self::VALID_TASK_DESCRIPTION);
        $this->assertInstanceOf(
            Task::class,
            $task,
            'When creating a new task the instance must be of type '. Task::class. '. '. gettype($task) . ' Received.'
        );
        $this->assertInstanceOf(
            \DateTime::class,
            $task->getDueDate(),
            'When creating a new task the instance of dueDate must be of type '. DateTime::class. '. '. gettype($task->getDueDate()) . ' Received.'
        );
        $this->assertEquals(
            self::VALID_TASK_NAME,
            $task->getName(),
            'The name used to create the Task was "'. self::VALID_TASK_NAME .'". But task has "'.$task->getName().'".'
        );
        $this->assertEquals(
            self::VALID_TASK_DESCRIPTION,
            $task->getDescription(),
            'The description used to create the Task was "'. self::VALID_TASK_DESCRIPTION .'". But task has "'.$task->getDescription().'".'
        );
    }

    public function testInvalidArgumentCount(): void
    {
        $this->expectException(\ArgumentCountError::class);
        $task = new Task();

        $this->expectException(\ArgumentCountError::class);
        $task = new Task(self::VALID_TASK_NAME);
    }

    public function testInvalidName(): void
    {
        $this->expectException(\TypeError::class);
        $task = new Task(null, self::VALID_TASK_DUE_DATE);
    }

    public function testBlankName(): void
    {
        $this->expectException(\RuntimeException::class);
        $task = new Task("", self::VALID_TASK_DUE_DATE);
    }

    public function testInvalidDueDate(): void
    {
        $this->expectException(\TypeError::class);
        $task = new Task(self::VALID_TASK_NAME, null);
    }

    public function testBlankDueDate(): void
    {
        $this->expectException(\RuntimeException::class);
        $task = new Task(self::VALID_TASK_NAME, "");
    }

    public function testNotValidDateFormat(): void
    {
        $this->expectException(\RuntimeException::class);
        $task = new Task(self::VALID_TASK_NAME, '2023-06-22 14:00:00:00');
    }

    public function testInvalidDescription(): void
    {
        $this->expectException(\RuntimeException::class);
        new Task(self::VALID_TASK_NAME, self::VALID_TASK_DUE_DATE, $this->getInvalidDescription());
    }

    private function getInvalidDescription(): string
    {
        $invalidTaskDescription = "";
        while(strlen($invalidTaskDescription) < 501){
            $invalidTaskDescription .= "a";
        }
        return $invalidTaskDescription;
    }
}
