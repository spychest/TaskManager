<?php

namespace App\Service;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;

class TaskService
{
    private TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getAllTasks(): array
    {
        return $this->taskRepository->findAll();
    }

    public function getTaskFromRequest(Request $request): Task
    {
        if(!$this->checkRequestToCreateTask($request)){
            throw new BadRequestException('Bad request: At least one of the parameter is missing');
        }

        return $this->createTaskFromRequest($request);
    }

    public function getTaskById(int $id): ?Task
    {
        return $this->taskRepository->findOneById($id);
    }

    public function registerTask(Task $task): void
    {
        $this->taskRepository->save($task, true);
    }

    public function removeTask(Task $task)
    {
        $this->taskRepository->remove($task, true);
    }

    private function checkRequestToCreateTask(Request $request): bool
    {
        return !empty($request->request->get('taskName'))
            && !empty($request->request->get('dueDate'));
    }

    private function createTaskFromRequest(Request $request): Task
    {
        $taskName = $request->request->get('taskName');
        $taskDueDate = $request->request->get('dueDate');
        $description = $request->request->get('taskDescription');
        return new Task($taskName, $taskDueDate, $description);
    }
}