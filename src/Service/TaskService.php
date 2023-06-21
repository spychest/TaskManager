<?php

namespace App\Service;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskService
{
    private TaskRepository $taskRepository;

    private ValidatorInterface $validator;

    public function __construct(TaskRepository $taskRepository, ValidatorInterface $validator)
    {
        $this->taskRepository = $taskRepository;
        $this->validator = $validator;
    }

    public function createTaskFromArray(array $dataArray): Task
    {
        if (! $this->checkIfArrayIsValid($dataArray)) {
            throw new BadRequestHttpException('Au moins une des données attendue est manquante');
        }

        $task = new Task($dataArray['taskName'], $dataArray['taskDueDate'], $dataArray['taskDescription']);

        $this->validateTask($task);

        return $task;
    }

    public function updateTaskFromArray(Task $task, array $dataArray): Task
    {
        if (! $this->checkIfArrayIsValid($dataArray)) {
            throw new BadRequestHttpException('Au moins une des données attendue est manquante');
        }

        $task->setName($dataArray['taskName'])
            ->setDueDate(new \DateTime($dataArray['taskDueDate']))
            ->setDescription($dataArray['taskDescription']);

        $this->validateTask($task);

        return $task;
    }

    private function checkIfArrayIsValid(array $dataArray): bool
    {
        return in_array('taskName', array_keys($dataArray))
            && in_array('taskDueDate', array_keys($dataArray))
            && in_array('taskDescription', array_keys($dataArray));
    }

    private function validateTask(Task $task): void
    {
        $errors = $this->validator->validate($task);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            throw new BadRequestHttpException($errorsString);
        }
    }

    public function getAllTasks(): array
    {
        return $this->taskRepository->findAll();
    }

    public function getTaskById(int $id): ?Task
    {
        return $this->taskRepository->findOneById($id);
    }

    public function registerTask(Task $task): void
    {
        $this->taskRepository->save($task, true);
    }

    public function removeTask(Task $task): void
    {
        $this->taskRepository->remove($task, true);
    }
}
